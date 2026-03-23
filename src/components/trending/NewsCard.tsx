"use client";

import Link from "next/link";
import type { TrendingFeedItem } from "@/types/trending";
import { cn } from "@/lib/utils";

const SOURCE_ACCENT: Record<string, string> = {
  ESPN: "var(--red-accent)",
  Twitter: "var(--blue)",
  Reddit: "var(--orange)",
  Beat: "var(--purple)",
  NFL: "var(--green)",
  PFF: "var(--txt-2)",
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
  const accent = SOURCE_ACCENT[item.source] ?? "var(--txt-2)";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)]",
        "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--border-md)] hover:shadow-[var(--shadow-md)]",
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
            className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--txt)]"
            style={{ backgroundColor: accent }}
          >
            {SOURCE_LABEL[item.source] ?? item.source}
          </span>
          <span className="text-[11px] text-[var(--txt-2)]">
            <span className="font-medium text-[var(--txt-2)]">{item.author}</span>
            <span className="text-[var(--txt-muted)]"> · </span>
            {item.timeAgo}
          </span>
        </div>

        <h3 className="mt-2 text-[13px] font-semibold leading-snug text-[var(--txt)]">{item.headline}</h3>
        <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[var(--txt-2)]">{item.body}</p>

        {item.playerTags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.playerTags.map((name) => (
              <Link
                key={name}
                href={`/search?q=${encodeURIComponent(name)}`}
                className="rounded-full border border-[var(--green-border)] bg-[var(--green-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--green)] transition hover:border-[color-mix(in_srgb,var(--green)_40%,transparent)] hover:bg-[var(--green-light)]"
              >
                {name}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-3 text-[10px] font-medium text-[var(--txt-muted)]">
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
    <div className="animate-pulse overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
      <div className="h-2 w-24 rounded bg-[var(--bg-subtle-2)]" />
      <div className="mt-3 h-3 w-full rounded bg-[var(--bg-subtle)]" />
      <div className="mt-2 h-3 w-[92%] rounded bg-[var(--bg-subtle)]" />
      <div className="mt-3 h-3 w-2/3 rounded bg-[var(--bg-subtle)]" />
    </div>
  );
}
