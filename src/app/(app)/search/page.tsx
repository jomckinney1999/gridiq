"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAppShell } from "@/components/layout/AppShell";
import { AIResponseCard } from "@/components/search/AIResponseCard";
import { DataTable } from "@/components/search/DataTable";
import { FollowUpSuggestions } from "@/components/search/FollowUpSuggestions";
import { SearchBar } from "@/components/search/SearchBar";
import { StatCardGrid } from "@/components/search/StatCardGrid";
import type { ChatMessage, GridIQAPIResponse } from "@/types/gridiq-query";

const MAX_MESSAGES = 20;

const QUICK_PILLS = [
  "How many routes did Waddle run in week 7 of 2023?",
  "Jayden Daniels fumbles in the 2024 playoffs",
  "CeeDee Lamb advanced stats 2024",
  "Rueben Bain prospect profile",
  "Josh Allen vs Mahomes EPA comparison 2024",
] as const;

const EXAMPLE_CARDS = [
  {
    q: "Routes run — single game",
    example: "How many routes did Waddle run in week 7 of 2023?",
    border: "border-l-[#00ff87]",
  },
  {
    q: "Turnovers — playoff splits",
    example: "Jayden Daniels fumbles in the 2024 playoffs",
    border: "border-l-[#ff6b2b]",
  },
  {
    q: "Advanced WR profile",
    example: "CeeDee Lamb advanced stats 2024",
    border: "border-l-[#3b9eff]",
  },
] as const;

function normalizeResponse(data: Record<string, unknown>): GridIQAPIResponse {
  return {
    intent: String(data.intent ?? "general"),
    entities: (data.entities as GridIQAPIResponse["entities"]) ?? {},
    display_type: String(data.display_type ?? "general"),
    response_text: String(data.response_text ?? ""),
    key_stats: Array.isArray(data.key_stats) ? (data.key_stats as GridIQAPIResponse["key_stats"]) : [],
    table_data: (data.table_data as GridIQAPIResponse["table_data"]) ?? null,
    follow_up_suggestions: Array.isArray(data.follow_up_suggestions)
      ? (data.follow_up_suggestions as string[])
      : [],
    rawText: typeof data.rawText === "string" ? data.rawText : undefined,
    conversationHistory: data.conversationHistory as GridIQAPIResponse["conversationHistory"],
  };
}

function SearchResultsSkeleton() {
  return (
    <div className="animate-pulse space-y-6 px-4 py-6 sm:px-6">
      <div className="space-y-2 rounded-xl border-[0.5px] border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)] p-4">
        <div className="h-3 w-40 rounded bg-[rgba(255,255,255,0.06)]" />
        <div className="h-3 w-full rounded bg-[rgba(255,255,255,0.04)]" />
        <div className="h-3 w-[92%] rounded bg-[rgba(255,255,255,0.04)]" />
        <div className="h-3 w-[80%] rounded bg-[rgba(255,255,255,0.04)]" />
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl border-[0.5px] border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)]"
          />
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border-[0.5px] border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)]">
        <div className="h-10 bg-[rgba(255,255,255,0.03)]" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-12 border-t border-[rgba(255,255,255,0.04)]" />
        ))}
      </div>
    </div>
  );
}

type Turn = {
  id: string;
  query: string;
  response: GridIQAPIResponse;
};

function SearchPageInner() {
  const searchParams = useSearchParams();
  const { addRecentQuery } = useAppShell();

  const [query, setQuery] = useState("");
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitNote, setLimitNote] = useState<string | null>(null);

  const conversationHistoryRef = useRef<ChatMessage[]>([]);
  conversationHistoryRef.current = conversationHistory;

  const runQueryRef = useRef<(raw?: string) => Promise<void>>(async () => {});

  const isLoadingRef = useRef(false);
  isLoadingRef.current = isLoading;

  const runQuery = useCallback(
    async (raw?: string) => {
      const q = (raw ?? query).trim();
      if (!q) return;
      if (isLoadingRef.current) return;

      setError(null);
      setLimitNote(null);
      setIsLoading(true);

      let hist = conversationHistoryRef.current;
      if (hist.length >= MAX_MESSAGES) {
        hist = [];
        setConversationHistory([]);
        setLimitNote("Starting a fresh thread — 10-turn conversation limit reached.");
      }

      try {
        const res = await fetch("/api/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q, conversationHistory: hist }),
        });

        const data = (await res.json()) as Record<string, unknown>;

        if (!res.ok) {
          throw new Error(String(data.error ?? "Request failed"));
        }

        const parsed = normalizeResponse(data);
        const nextHist = (data.conversationHistory as ChatMessage[]) ?? hist;
        setConversationHistory(nextHist);

        setTurns((prev) => [
          ...prev,
          { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, query: q, response: parsed },
        ]);
        addRecentQuery(q);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [addRecentQuery, query],
  );

  runQueryRef.current = runQuery;

  const qParam = searchParams.get("q") ?? "";

  useEffect(() => {
    if (!qParam.trim()) return;
    const decoded = decodeURIComponent(qParam);
    setQuery(decoded);
    void runQueryRef.current(decoded);
  }, [qParam]);

  function handleSubmit() {
    void runQuery();
  }

  function onFollowUp(s: string) {
    setQuery(s);
    void runQuery(s);
  }

  const showEmpty = turns.length === 0 && !isLoading;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <div className="border-b border-[rgba(255,255,255,0.06)] px-4 py-3 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {QUICK_PILLS.map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => {
                setQuery(pill);
                void runQuery(pill);
              }}
              className="rounded-full border border-[rgba(255,255,255,0.08)] bg-transparent px-3 py-1.5 text-left text-[12px] text-[#8888a0] transition hover:border-[rgba(0,255,135,0.35)] hover:bg-[rgba(0,255,135,0.06)] hover:text-[#00ff87]"
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {limitNote ? (
        <div className="border-b border-[rgba(0,255,135,0.2)] bg-[rgba(0,255,135,0.06)] px-4 py-2 text-center text-[12px] text-[#8888a0] sm:px-6">
          {limitNote}
        </div>
      ) : null}

      {error ? (
        <div className="border-b border-[rgba(255,107,43,0.25)] bg-[rgba(255,107,43,0.08)] px-4 py-3 text-[13px] text-[#ff6b2b] sm:px-6">
          {error}
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {showEmpty ? (
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[rgba(0,255,135,0.1)] text-[32px] text-[#00ff87]">
              ✦
            </div>
            <h2 className="mt-6 text-[24px] font-bold text-[#f2f2f5]">Ask GridIQ anything</h2>
            <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-[#8888a0]">
              Try: routes run, fumbles, prospect profiles, advanced metrics, player comparisons
            </p>
            <div className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
              {EXAMPLE_CARDS.map((c) => (
                <button
                  key={c.example}
                  type="button"
                  onClick={() => onFollowUp(c.example)}
                  className={`rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0d0d10] p-4 text-left transition hover:border-[rgba(0,255,135,0.25)] ${c.border} border-l-2`}
                >
                  <div className="text-[12px] font-bold uppercase tracking-wide text-[#44445a]">{c.q}</div>
                  <div className="mt-2 text-[13px] leading-snug text-[#f2f2f5]">{c.example}</div>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {turns.length > 0 ? (
          <div className="mx-auto max-w-5xl space-y-10 px-4 py-8 sm:px-6">
            {turns.map((turn, idx) => (
              <div key={turn.id}>
                {idx > 0 ? (
                  <div
                    className="mb-10 h-px w-full bg-[rgba(255,255,255,0.06)]"
                    aria-hidden
                  />
                ) : null}
                <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[#44445a]">
                  You asked
                </div>
                <p className="mb-4 text-[14px] text-[#f2f2f5]">{turn.query}</p>

                <div className="space-y-6">
                  <AIResponseCard response={turn.response} />
                  {turn.response.key_stats?.length ? (
                    <StatCardGrid stats={turn.response.key_stats} />
                  ) : null}
                  {turn.response.table_data ? (
                    <DataTable table={turn.response.table_data} />
                  ) : null}
                  {turn.response.follow_up_suggestions?.length ? (
                    <FollowUpSuggestions
                      suggestions={turn.response.follow_up_suggestions}
                      onPick={onFollowUp}
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {isLoading ? <SearchResultsSkeleton /> : null}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] flex-col">
          <div className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(5,5,7,0.95)] px-6 py-4">
            <div className="h-12 animate-pulse rounded-xl bg-[rgba(255,255,255,0.04)]" />
          </div>
          <SearchResultsSkeleton />
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
