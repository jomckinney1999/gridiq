"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { TierListHeader } from "@/components/tierlist/TierListHeader";
import { TierRow } from "@/components/tierlist/TierRow";
import { PlayerChip } from "@/components/tierlist/PlayerChip";
import { movePlayer } from "@/lib/tierlist/state";
import { applyPresetToState, TIERLIST_PRESETS } from "@/lib/tierlist/presets";
import {
  emptyTiers,
  TIER_ORDER,
  type PositionFilter,
  type TierKey,
  type TierListPlayer,
  type TiersState,
} from "@/types/tierlist";
import { cn } from "@/lib/utils";

type PoolState = { tiers: TiersState; poolIds: string[] };

type PoolAction =
  | { type: "move"; playerId: string; target: TierKey | "pool" }
  | { type: "replace"; tiers: TiersState; poolIds: string[] };

function poolReducer(state: PoolState, action: PoolAction): PoolState {
  if (action.type === "move") {
    return movePlayer(action.playerId, action.target, state.tiers, state.poolIds);
  }
  return { tiers: action.tiers, poolIds: action.poolIds };
}

type DragPayload = { playerId: string; from: string };

function parseDragPayload(e: React.DragEvent): DragPayload | null {
  try {
    const raw = e.dataTransfer.getData("application/json");
    if (!raw) return null;
    const p = JSON.parse(raw) as DragPayload;
    if (!p.playerId || !p.from) return null;
    return p;
  } catch {
    return null;
  }
}

export default function TierListMakerPage() {
  const [positionFilter, setPositionFilter] = useState<PositionFilter>("QB");
  const [title, setTitle] = useState("My NFL Tier List");
  const [playersById, setPlayersById] = useState<Record<string, TierListPlayer>>({});
  const [list, dispatch] = useReducer(poolReducer, {
    tiers: emptyTiers(),
    poolIds: [] as string[],
  });
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoverTarget, setHoverTarget] = useState<TierKey | "pool" | null>(null);
  const [dropFlash, setDropFlash] = useState<TierKey | "pool" | null>(null);
  const [poolSearch, setPoolSearch] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [shareId, setShareId] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  const fetchPlayers = useCallback(async (pos: PositionFilter) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tierlist/players?position=${pos}`);
      const data = (await res.json()) as { players: TierListPlayer[] };
      const map = Object.fromEntries(data.players.map((p) => [p.id, p]));
      setPlayersById(map);
      dispatch({
        type: "replace",
        tiers: emptyTiers(),
        poolIds: data.players.map((p) => p.id),
      });
      setShareId(null);
    } catch {
      setBanner("Could not load players.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const end = () => setDraggingId(null);
    window.addEventListener("dragend", end);
    return () => window.removeEventListener("dragend", end);
  }, []);

  useEffect(() => {
    void fetchPlayers("QB");
  }, [fetchPlayers]);

  const handlePositionChange = (p: PositionFilter) => {
    setPositionFilter(p);
    void fetchPlayers(p);
  };

  const poolPlayers = useMemo(() => {
    const q = poolSearch.trim().toLowerCase();
    return list.poolIds
      .map((id) => playersById[id])
      .filter(Boolean)
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          (p.team && p.team.toLowerCase().includes(q)),
      );
  }, [list.poolIds, playersById, poolSearch]);

  const handleDropOn =
    (target: TierKey | "pool") => (e: React.DragEvent) => {
      e.preventDefault();
      setHoverTarget(null);
      const payload = parseDragPayload(e);
      if (!payload) return;
      if (payload.from === target) return;
      dispatch({ type: "move", playerId: payload.playerId, target });
      setDropFlash(target);
      window.setTimeout(() => setDropFlash(null), 350);
    };

  const handleDragOver =
    (target: TierKey | "pool") => (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setHoverTarget(target);
    };

  const handleDragLeave = (target: TierKey | "pool") => (e: React.DragEvent) => {
    e.preventDefault();
    const related = e.relatedTarget as Node | null;
    if (e.currentTarget.contains(related)) return;
    setHoverTarget((h) => (h === target ? null : h));
  };

  const removeToPool = (playerId: string) => {
    dispatch({ type: "move", playerId, target: "pool" });
  };

  const resetList = () => {
    dispatch({
      type: "replace",
      tiers: emptyTiers(),
      poolIds: Object.keys(playersById),
    });
    setBanner(null);
  };

  const loadPreset = useCallback(async (presetId: string) => {
    const preset = TIERLIST_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setTitle(preset.title);
    setPositionFilter(preset.position_filter);
    setLoading(true);
    setBanner(null);
    try {
      const res = await fetch(`/api/tierlist/players?position=${preset.position_filter}`);
      const data = (await res.json()) as { players: TierListPlayer[] };
      const map = Object.fromEntries(data.players.map((p) => [p.id, p]));
      setPlayersById(map);
      const { tiers, unrankedIds } = applyPresetToState(preset, data.players);
      dispatch({ type: "replace", tiers, poolIds: unrankedIds });
      setShareId(null);
      setBanner(`Loaded “${preset.label}”.`);
    } catch {
      setBanner("Could not load preset.");
    } finally {
      setLoading(false);
    }
  }, []);

  const publish = async () => {
    setPublishing(true);
    setBanner(null);
    try {
      const res = await fetch("/api/tierlist/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          position_filter: positionFilter,
          tiers: list.tiers,
        }),
      });
      const data = (await res.json()) as { share_id?: string; url?: string; error?: string };
      if (!res.ok) {
        setBanner(data.error ?? "Save failed.");
        return;
      }
      if (data.share_id) setShareId(data.share_id);
      setBanner("Saved. Share link ready.");
    } catch {
      setBanner("Network error while saving.");
    } finally {
      setPublishing(false);
    }
  };

  const copyShareLink = async () => {
    const base =
      typeof window !== "undefined" ? window.location.origin.replace(/\/$/, "") : "";
    const path = shareId ? `/tierlist/${shareId}` : "/tierlist";
    const full = `${base}${path}`;
    try {
      await navigator.clipboard.writeText(full);
      setBanner(shareId ? "Link copied to clipboard." : "Maker URL copied (publish to get a share link).");
    } catch {
      setBanner("Could not copy.");
    }
  };

  const saveImage = async () => {
    if (!captureRef.current) return;
    setBanner(null);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor:
          typeof window !== "undefined"
            ? getComputedStyle(document.documentElement).getPropertyValue("--bg-base").trim() ||
              undefined
            : undefined,
        scale: 2,
        logging: false,
      });
      const a = document.createElement("a");
      a.download = `nfl-tier-list-${title.replace(/\s+/g, "-").slice(0, 40)}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
      setBanner("Image downloaded.");
    } catch {
      setBanner("Could not save image.");
    }
  };

  const tierPlayers = (key: TierKey) =>
    list.tiers[key].map((id) => playersById[id]).filter(Boolean) as TierListPlayer[];

  const presets = TIERLIST_PRESETS.map((p) => ({
    id: p.id,
    label: p.label,
    onClick: () => void loadPreset(p.id),
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--green)]">
        NFL Tier Lists
      </div>
      <h1 className="text-[22px] font-extrabold tracking-[-0.5px] text-[var(--txt)]">
        Tier list maker
      </h1>
      <p className="mt-1 text-[13px] text-[var(--txt-2)]">
        Drag players into tiers. Publish to get a shareable link.
      </p>

      <div className="mt-8">
        <TierListHeader
          title={title}
          onTitleChange={setTitle}
          positionFilter={positionFilter}
          onPositionChange={handlePositionChange}
          onReset={resetList}
          onShareLink={copyShareLink}
          onSaveImage={saveImage}
          onPublish={publish}
          publishing={publishing}
          presets={presets}
        />
      </div>

      {banner ? (
        <p className="mt-4 rounded-lg border border-[var(--green-border)] bg-[var(--green-light)] px-3 py-2 text-[12px] text-[var(--green)]">
          {banner}
        </p>
      ) : null}

      <div ref={captureRef} className="mt-8 space-y-3">
        <div className="border-b border-[var(--border)] pb-3">
          <h2 className="text-[16px] font-bold text-[var(--txt)]">{title}</h2>
          <p className="text-[11px] text-[var(--txt-muted)]">{positionFilter} · NFL Stat Guru</p>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[88px] animate-pulse rounded-xl bg-[var(--bg-subtle)]" />
            ))}
          </div>
        ) : (
          TIER_ORDER.map((tier) => (
            <div
              key={tier}
              className={cn(
                dropFlash === tier && "animate-[tierlist-drop_0.35s_ease-out]",
              )}
            >
              <TierRow
                tier={tier}
                players={tierPlayers(tier)}
                draggingId={draggingId}
                dropHighlight={hoverTarget === tier}
                onDragOver={handleDragOver(tier)}
                onDragLeave={handleDragLeave(tier)}
                onDrop={handleDropOn(tier)}
                onRemovePlayer={removeToPool}
                onDragPick={setDraggingId}
              />
            </div>
          ))
        )}
      </div>

      <div className="mt-8">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--txt-3)]">
          Unranked pool
        </div>
        <input
          type="search"
          value={poolSearch}
          onChange={(e) => setPoolSearch(e.target.value)}
          placeholder="Search players…"
          className="mb-3 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-[13px] text-[var(--txt)] outline-none placeholder:text-[var(--txt-3)]"
        />
        <div
          className={cn(
            "min-h-[120px] rounded-xl border border-dashed p-3 transition-all duration-200",
            hoverTarget === "pool"
              ? "border-[var(--green)] bg-[var(--green-light)]"
              : "border-[var(--border-md)] bg-[var(--bg-secondary)]",
            dropFlash === "pool" && "animate-[tierlist-drop_0.35s_ease-out]",
          )}
          onDragOver={handleDragOver("pool")}
          onDragLeave={handleDragLeave("pool")}
          onDrop={handleDropOn("pool")}
        >
          <div className="flex flex-wrap gap-2">
            {poolPlayers.map((p) => (
              <PlayerChip
                key={p.id}
                player={p}
                from="pool"
                dragging={draggingId === p.id}
                showRemove={false}
                onDragStartPick={() => setDraggingId(p.id)}
              />
            ))}
          </div>
          {!loading && poolPlayers.length === 0 ? (
            <p className="py-6 text-center text-[12px] text-[var(--txt-muted)]">No players in pool.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
