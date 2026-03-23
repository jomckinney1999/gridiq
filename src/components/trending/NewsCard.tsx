"use client";

import Link from "next/link";
import type { TrendingFeedItem } from "@/types/trending";
import { cn } from "@/lib/utils";

const SOURCE_ACCENT: Record<string, string> = {
  ESPN: "#dc2626",
  Twitter: "#3b9eff",
  Reddit: "#ff6b2b",
  Beat: "#a855f7",
  NFL: "#00ff87",
  PFF: "#c4a35a",
};

const SOURCE_LABEL: Record<string, string> = {
  ESPN: "ESPN",
  Twitter: "X",
  Reddit: "Reddit",
  Beat: "Beat",
  NFL: "NFL",
  PFF: "PFF",
};

type NewsCardProps = {
  item: TrendingFeedItem;
};

export function NewsCard({ item }: NewsCardProps) {
  const accent = SOURCE_ACCENT[item.source] ?? "#8888a0";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0d0d10]",
        "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.12)] hover:shadow-[0_8px_28px_rgba(0,0,0,0.35)]",
      )}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, ${accent}, transparent)`,
        }}
      />
      <div className="p-4 pt-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#050507]"
            style={{ backgroundColor: accent }}
          >
            {SOURCE_LABEL[item.source] ?? item.source}
          </span>
          <span className="text-[11px] text-[#8888a0]">
            <span className="font-medium text-[#b8b8c8]">{item.author}</span>
            <span className="text-[#55556a]"> · </span>
            {item.timeAgo}
          </span>
        </div>

        <h3 className="mt-2 text-[13px] font-semibold leading-snug text-[#f2f2f5]">{item.headline}</h3>
        <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#8888a0]">{item.body}</p>

        {item.playerTags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.playerTags.map((name) => (
              <Link
                key={name}
                href={`/search?q=${encodeURIComponent(name)}`}
                className="rounded-full border border-[rgba(0,255,135,0.2)] bg-[rgba(0,255,135,0.06)] px-2 py-0.5 text-[10px] font-semibold text-[#00ff87] transition hover:border-[rgba(0,255,135,0.4)] hover:bg-[rgba(0,255,135,0.1)]"
              >
                {name}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-3 text-[10px] font-medium text-[#55556a]">
          <span>{item.engagement.likes.toLocaleString()} likes</span>
          <span>{item.engagement.reposts.toLocaleString()} reposts</span>
          <span>{item.engagement.views.toLocaleString()} views</span>
        </div>
      </div>
    </article>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0d0d10] p-4">
      <div className="h-2 w-24 rounded bg-[rgba(255,255,255,0.06)]" />
      <div className="mt-3 h-3 w-full rounded bg-[rgba(255,255,255,0.04)]" />
      <div className="mt-2 h-3 w-[92%] rounded bg-[rgba(255,255,255,0.04)]" />
      <div className="mt-3 h-3 w-2/3 rounded bg-[rgba(255,255,255,0.04)]" />
    </div>
  );
}
