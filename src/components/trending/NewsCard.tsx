"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState, type ReactNode } from "react";
import { safeText } from "@/lib/safe-text";
import { initialsFromName, JOURNALIST_INFO, lookupJournalist } from "@/lib/trending/journalists";
import type { TrendingFeedItem } from "@/types/trending";
import { cn } from "@/lib/utils";

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

/** Brand-colored gradient fallback when `image_url` is missing or fails to load (article cards). */
const SOURCE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  ESPN: { bg: "#d00", text: "#fff", label: "ESPN" },
  NFL: { bg: "#013369", text: "#fff", label: "NFL.com" },
  PFT: { bg: "#e8891a", text: "#fff", label: "Pro Football Talk" },
  NBC: { bg: "#e8891a", text: "#fff", label: "NBC Sports" },
  BR: { bg: "#f26522", text: "#fff", label: "Bleacher Report" },
  PFR: { bg: "#1a1a1a", text: "#fff", label: "PFR" },
  PFF: { bg: "#1a1a1a", text: "#fff", label: "PFF" },
  Reddit: { bg: "#ff4500", text: "#fff", label: "" },
};

function badgeFor(item: TrendingFeedItem) {
  const src = safeText(item.source, "?");
  return (
    SOURCE_BADGE[src] ?? {
      bg: "var(--bg-subtle-2)",
      fg: "var(--txt)",
      short: src,
    }
  );
}

function ArticleImageFallback({ source, className }: { source: string; className?: string }) {
  const c = SOURCE_COLORS[source] ?? {
    bg: "#374151",
    text: "#fff",
    label: "",
  };
  const display = c.label || SOURCE_BADGE[source]?.short || source;
  return (
    <div
      className={cn("flex h-full w-full items-center justify-center px-3 text-center", className)}
      style={{
        background: `linear-gradient(145deg, color-mix(in srgb, ${c.bg} 92%, #fff) 0%, ${c.bg} 42%, rgba(0,0,0,0.42) 100%)`,
        color: c.text,
      }}
    >
      <span className="text-[11px] font-extrabold leading-tight tracking-tight sm:text-xs">{display}</span>
    </div>
  );
}

function TagChips({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {tags.map((raw) => {
        const name = safeText(raw, "");
        if (!name) return null;
        return (
          <Link
            key={name}
            href={`/search?q=${encodeURIComponent(name)}`}
            className="rounded-full border border-[color-mix(in_srgb,var(--green)_35%,transparent)] bg-[color-mix(in_srgb,var(--green)_12%,transparent)] px-2 py-0.5 text-[10px] font-semibold text-[var(--green)] transition hover:border-[color-mix(in_srgb,var(--green)_50%,transparent)]"
          >
            {name}
          </Link>
        );
      })}
    </div>
  );
}

function renderTweetText(text: string) {
  const parts = text.split(/(#[\w]+|@[\w]+)/g);
  return parts.map((part, i) => {
    if (part.startsWith("#") || part.startsWith("@")) {
      return (
        <span key={i} className="text-[#1da1f2]">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

type FeedImageProps = {
  src: string | null | undefined;
  alt: string;
  className: string;
  sizes: string;
  placeholder: ReactNode;
};

function FeedImage({ src, alt, className, sizes, placeholder }: FeedImageProps) {
  const [failed, setFailed] = useState(false);
  const showPh = !src || failed;

  const onErr = useCallback(() => setFailed(true), []);

  if (showPh) {
    return <div className={className}>{placeholder}</div>;
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
        onError={onErr}
        unoptimized={false}
      />
    </div>
  );
}

// —— Featured ——

export type FeaturedNewsCardProps = { item: TrendingFeedItem; className?: string };

export function FeaturedNewsCard({ item, className }: FeaturedNewsCardProps) {
  const href = item.url && item.url !== "#" ? item.url : undefined;
  const badge = badgeFor(item);
  const j = lookupJournalist(item.author);
  const initials = j?.initials ?? initialsFromName(item.author);
  const avatarBg = j?.color ?? badge.bg;

  const allTags = [...item.playerTags, ...(item.teamTags ?? [])];

  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-md)]",
        className,
      )}
    >
      <div className="flex flex-col gap-0 md:flex-row">
        <div className="relative h-56 w-full shrink-0 overflow-hidden md:h-auto md:min-h-[200px] md:w-[280px]">
          <FeedImage
            src={item.imageUrl}
            alt=""
            className="h-full min-h-[14rem] w-full md:min-h-[200px]"
            sizes="280px"
            placeholder={<ArticleImageFallback source={item.source} className="min-h-[14rem] md:min-h-[200px]" />}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center p-5">
          <p className="text-[12px] font-semibold text-[var(--green)]">
            <span style={{ color: "var(--green)" }}>{badge.short}</span>
            <span className="text-[var(--txt-muted)]"> · </span>
            <span>{safeText(item.author, "—")}</span>
            <span className="text-[var(--txt-muted)]"> · </span>
            <span>{safeText(item.timeAgo, "—")}</span>
          </p>
          <h2 className="mt-2 text-[16px] font-extrabold leading-snug text-[var(--txt)]">
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--green)] hover:underline">
                {safeText(item.headline, "—")}
              </a>
            ) : (
              safeText(item.headline, "—")
            )}
          </h2>
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[var(--txt-2)]">{safeText(item.body, "")}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ backgroundColor: avatarBg }}
            >
              {initials}
            </div>
            <span className="text-[13px] font-semibold text-[var(--txt)]">{safeText(item.author, "—")}</span>
            {allTags.length ? (
              <div className="flex flex-wrap gap-1">
                {allTags.slice(0, 6).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[color-mix(in_srgb,var(--green)_35%,transparent)] bg-[color-mix(in_srgb,var(--green)_10%,transparent)] px-2 py-0.5 text-[10px] font-semibold text-[var(--green)]"
                  >
                    {safeText(t, "")}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-[13px] font-semibold text-[#2563eb] hover:underline"
            >
              Read More →
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

// —— Article ——

export type ArticleNewsCardProps = { item: TrendingFeedItem };

export function ArticleNewsCard({ item }: ArticleNewsCardProps) {
  const href = item.url && item.url !== "#" ? item.url : undefined;
  const badge = badgeFor(item);
  const j = lookupJournalist(item.author);
  const initials = j?.initials ?? initialsFromName(item.author);
  const avatarBg = item.journalistColor ?? j?.color ?? badge.bg;
  const allTags = [...item.playerTags, ...(item.teamTags ?? [])];

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)]",
        "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[var(--border-md)] hover:shadow-[var(--shadow-md)]",
      )}
    >
      <div className="relative h-[140px] w-full">
        <FeedImage
          src={item.imageUrl}
          alt=""
          className="h-[140px] w-full"
          sizes="(max-width: 768px) 100vw, 50vw"
          placeholder={<ArticleImageFallback source={item.source} className="h-[140px]" />}
        />
        <span
          className="absolute left-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
          style={{ backgroundColor: badge.bg, color: badge.fg }}
        >
          {badge.short}
        </span>
        <span className="absolute right-2 top-2 rounded bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white">
          {safeText(item.timeAgo, "—")}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: avatarBg }}
          >
            {initials}
          </div>
          <span className="text-[12px] font-semibold text-[var(--txt)]">{safeText(item.author, "—")}</span>
        </div>
        <h3 className="mt-2 text-[13.5px] font-bold leading-snug text-[var(--txt)]">
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--green)] hover:underline">
              {safeText(item.headline, "—")}
            </a>
          ) : (
            safeText(item.headline, "—")
          )}
        </h3>
        <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[var(--txt-2)]">{safeText(item.body, "")}</p>
        <TagChips tags={allTags} />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3 text-[10px] text-[var(--txt-3)]">
          <span>
            Via {safeText(item.sourceName, "Source")}
            {item.isVerified ? (
              <span className="ml-1 rounded border border-[var(--border)] px-1 py-0.5 text-[9px] font-bold text-[var(--txt-muted)]">
                · Verified
              </span>
            ) : null}
          </span>
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-[12px] font-semibold text-[#2563eb] hover:underline">
              Read More →
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

// —— Tweet / X ——

export type TweetEmbedCardProps = { item: TrendingFeedItem };

export function TweetEmbedCard({ item }: TweetEmbedCardProps) {
  const href = item.url && item.url !== "#" ? item.url : undefined;
  const j = lookupJournalist(item.author);
  const meta = j ?? {
    handle: item.twitterDisplayHandle ?? `@${item.author.replace(/\s+/g, "")}`,
    org: item.twitterOrg ?? "X",
    initials: initialsFromName(item.author),
    color: "#1da1f2",
  };
  const displayName = (() => {
    for (const [name] of Object.entries(JOURNALIST_INFO)) {
      if (item.author.includes(name)) return name;
    }
    return item.author;
  })();

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)]",
        "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]",
      )}
    >
      <div
        aria-hidden
        className="h-[2px] w-full bg-gradient-to-r from-[#1da1f2] to-transparent"
      />
      <div className="p-4 pt-3">
        <div className="flex gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
            style={{ backgroundColor: meta.color }}
          >
            {meta.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-1 text-[13px] font-bold text-[var(--txt)]">
                  <span>{displayName}</span>
                  <span className="text-[#1da1f2]" title="Verified">
                    ✓
                  </span>
                </div>
                <p className="text-[12px] text-[var(--txt-2)]">
                  {safeText(meta.handle, "")} · {safeText(meta.org, "")}
                </p>
              </div>
              <span className="ml-1 text-[18px] font-bold text-[var(--txt)]" aria-hidden>
                𝕏
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3 text-[13px] leading-relaxed text-[var(--txt)]">{renderTweetText(safeText(item.headline, ""))}</div>
        {item.imageUrl ? (
          <div className="relative mt-3 h-[160px] w-full overflow-hidden rounded-lg">
            <FeedImage
              src={item.imageUrl}
              alt=""
              className="h-[160px] w-full rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder={
                <div className="flex h-[160px] w-full items-center justify-center bg-[var(--bg-subtle-2)] text-4xl">📷</div>
              }
            />
          </div>
        ) : null}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-[var(--txt-2)]">
          <span title="Likes">♥ {Number(item.engagement?.likes ?? 0).toLocaleString()}</span>
          <span title="Reposts">↩ {Number(item.engagement?.reposts ?? 0).toLocaleString()}</span>
          <span title="Views">👁 {Number(item.engagement?.views ?? 0).toLocaleString()}</span>
          <span className="ml-auto text-[var(--txt-muted)]">{safeText(item.timeAgo, "—")}</span>
        </div>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex text-[12px] font-semibold text-[#2563eb] hover:underline"
          >
            Read on X →
          </a>
        ) : null}
      </div>
    </article>
  );
}

// —— Reddit ——

export type RedditNewsCardProps = { item: TrendingFeedItem };

export function RedditNewsCard({ item }: RedditNewsCardProps) {
  const href = item.url && item.url !== "#" ? item.url : undefined;
  const sub = item.redditSubreddit ?? "nfl";
  const user = item.redditUsername ?? "reddit";
  const preview = (item.bodyFull ?? item.body).trim();
  const showBody = preview.length > 0 && preview !== safeText(item.headline, "");

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)]",
        "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]",
      )}
    >
      <div
        aria-hidden
        className="h-[2px] w-full bg-gradient-to-r from-[#ff4500] to-transparent"
      />
      <div className="p-4 pt-3">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
          <span className="font-bold text-[#ff4500]">r/{safeText(sub, sub)}</span>
          <span className="text-[var(--txt-muted)]">u/{safeText(user, "")}</span>
          <span className="ml-auto text-[var(--txt-muted)]">{safeText(item.timeAgo, "—")}</span>
        </div>
        {item.redditFlair ? (
          <span className="mt-1 inline-block rounded border border-[var(--border)] bg-[var(--bg-subtle-2)] px-2 py-0.5 text-[10px] font-semibold text-[var(--txt-2)]">
            {safeText(item.redditFlair, "")}
          </span>
        ) : null}
        <h3 className="mt-2 text-[13.5px] font-bold leading-snug text-[var(--txt)]">
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-[#ff4500] hover:underline">
              {safeText(item.headline, "—")}
            </a>
          ) : (
            safeText(item.headline, "—")
          )}
        </h3>
        {showBody ? (
          <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-[var(--txt-2)]">{preview}</p>
        ) : null}
        {item.imageUrl ? (
          <div className="relative mt-3 h-[120px] w-full overflow-hidden rounded-lg">
            <FeedImage
              src={item.imageUrl}
              alt=""
              className="h-[120px] w-full rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder={
                <div className="flex h-[120px] w-full items-center justify-center bg-[var(--bg-subtle-2)] text-3xl">🖼</div>
              }
            />
          </div>
        ) : null}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3 text-[11px]">
          <span className="font-semibold text-[#ff4500]">↑ {Number(item.engagement?.likes ?? 0).toLocaleString()}</span>
          <span className="text-[var(--txt-2)]">💬 {Number(item.engagement?.reposts ?? 0).toLocaleString()}</span>
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="ml-auto text-[12px] font-semibold text-[#2563eb] hover:underline">
              Read Thread →
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

// —— Router ——

export function NewsFeedCard({ item }: { item: TrendingFeedItem }) {
  if (item.isReddit) return <RedditNewsCard item={item} />;
  if (item.source === "Twitter" || item.isTwitter) return <TweetEmbedCard item={item} />;
  return <ArticleNewsCard item={item} />;
}

/** @deprecated Prefer NewsFeedCard or ArticleNewsCard */
export function NewsCard({ item }: { item: TrendingFeedItem }) {
  return <NewsFeedCard item={item} />;
}

export function NewsCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
      <div className="h-[140px] w-full rounded-lg bg-[var(--bg-subtle-2)]" />
      <div className="mt-3 h-2 w-24 rounded bg-[var(--bg-subtle-2)]" />
      <div className="mt-3 h-3 w-full rounded bg-[var(--bg-subtle)]" />
      <div className="mt-2 h-3 w-[92%] rounded bg-[var(--bg-subtle)]" />
    </div>
  );
}
