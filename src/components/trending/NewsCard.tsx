"use client";

import Link from "next/link";
import { safeText } from "@/lib/safe-text";
import type { TrendingFeedItem } from "@/types/trending";
import { cn } from "@/lib/utils";

/** Badge background + label text color (readable on each brand). */
const SOURCE_BADGE: Record<string, { bg: string; fg: string; short: string }> = {
  ESPN: { bg: "#d00", fg: "#ffffff", short: "ESPN" },
  NFL: { bg: "#013369", fg: "#ffffff", short: "NFL" },
  PFT: { bg: "#e8891a", fg: "#ffffff", short: "PFT" },
  NBC: { bg: "#e8891a", fg: "#ffffff", short: "NBC" },
  BR: { bg: "#f26522", fg: "#ffffff", short: "BR" },
  PFR: { bg: "#1a1a1a", fg: "#ffffff", short: "PFR" },
  Reddit: { bg: "#ff4500", fg: "#ffffff", short: "Reddit" },
  PFF: { bg: "#1a1a1a", fg: "#ffffff", short: "PFF" },
};

function badgeFor(item: TrendingFeedItem) {
  const src = safeText(item.source, "?");
  return SOURCE_BADGE[src] ?? {
    bg: "var(--bg-subtle-2)",
    fg: "var(--txt)",
    short: src,
  };
}

type NewsCardProps = {
  item: TrendingFeedItem;
};

export function NewsCard({ item }: NewsCardProps) {
  const badge = badgeFor(item);
  const href = item.url && item.url !== "#" ? item.url : undefined;
  const isReddit = item.isReddit === true;

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
          background: `linear-gradient(90deg, ${typeof badge.bg === "string" && badge.bg.startsWith("#") ? badge.bg : "var(--green)"}, transparent)`,
        }}
      />
      <div className="p-4 pt-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            style={{ backgroundColor: badge.bg, color: badge.fg }}
          >
            {badge.short}
          </span>
          <span className="text-[11px] text-[var(--txt-2)]">
            <span className="font-medium text-[var(--txt-2)]">{safeText(item.author, "—")}</span>
            <span className="text-[var(--txt-muted)]"> · </span>
            {safeText(item.timeAgo, "—")}
          </span>
        </div>

        <h3 className="mt-2 text-[13px] font-semibold leading-snug text-[var(--txt)]">
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--green)] hover:underline">
              {safeText(item.headline, "—")}
            </a>
          ) : (
            safeText(item.headline, "—")
          )}
        </h3>
        <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[var(--txt-2)]">{safeText(item.body, "")}</p>

        {item.playerTags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.playerTags.map((raw) => {
              const name = safeText(raw, "");
              if (!name) return null;
              return (
              <Link
                key={name}
                href={`/search?q=${encodeURIComponent(name)}`}
                className="rounded-full border border-[var(--green-border)] bg-[var(--green-light)] px-2 py-0.5 text-[10px] font-semibold text-[var(--green)] transition hover:border-[color-mix(in_srgb,var(--green)_40%,transparent)] hover:bg-[var(--green-light)]"
              >
                {name}
              </Link>
            );
            })}
          </div>
        ) : null}

        {isReddit ? (
          <div className="mt-3 flex flex-wrap gap-4 text-[11px] font-semibold text-[var(--txt-2)]">
            <span title="Upvotes">
              ↑ {Number(item.engagement?.likes ?? 0).toLocaleString()}
            </span>
            <span title="Comments">
              💬 {Number(item.engagement?.reposts ?? 0).toLocaleString()}
            </span>
          </div>
        ) : null}

        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-[12px] font-semibold text-[var(--green)] hover:underline"
          >
            Read more →
          </a>
        ) : null}

        <p className="mt-3 border-t border-[var(--border)] pt-3 text-[10px] leading-snug text-[var(--txt-3)]">
          Via {safeText(item.sourceName, "Source")}
          {item.isVerified ? (
            <span className="ml-1 rounded border border-[var(--border)] px-1 py-0.5 text-[9px] font-bold text-[var(--txt-muted)]">
              Verified source
            </span>
          ) : null}
        </p>
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
