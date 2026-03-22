"use client";

import { useCallback, useEffect, useRef, type KeyboardEvent } from "react";

type SearchBarProps = {
  query: string;
  onQueryChange: (v: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

export function SearchBar({ query, onQueryChange, onSubmit, isLoading }: SearchBarProps) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [query, resize]);

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className="sticky top-0 z-40 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(5,5,7,0.95)] px-6 py-4 backdrop-blur-md">
      <div
        className="group flex items-end gap-3 rounded-xl border-[0.5px] border-[rgba(255,255,255,0.1)] bg-[#0d0d10] px-4 py-3 transition-all duration-200 hover:border-[rgba(0,255,135,0.3)] focus-within:border-[rgba(0,255,135,0.5)] focus-within:shadow-[0_0_0_3px_rgba(0,255,135,0.08)] sm:gap-4"
      >
        <div className="grid h-[28px] w-[28px] shrink-0 place-items-center rounded-lg bg-[rgba(0,255,135,0.1)]">
          <span className="text-[14px] font-light leading-none text-[#00ff87]">✦</span>
        </div>
        <textarea
          ref={taRef}
          rows={1}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask anything about NFL stats..."
          className="min-h-[24px] w-full resize-none border-0 bg-transparent py-1 text-[14px] leading-relaxed text-[#f2f2f5] outline-none placeholder:text-[#44445a]"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !query.trim()}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#00ff87] px-4 py-2 text-[13px] font-bold text-[#050507] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-[#050507] border-t-transparent"
                aria-hidden
              />
              Thinking...
            </>
          ) : (
            "Ask GridIQ"
          )}
        </button>
      </div>
    </div>
  );
}
