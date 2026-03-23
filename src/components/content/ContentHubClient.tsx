"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ARTICLES } from "@/lib/content/articles";
import { CATEGORY_ACCENT } from "@/lib/content/categories";
import type { ContentCategory } from "@/lib/content/categories";
import { VIDEOS } from "@/lib/content/videos";
import { ContentNewsletter } from "@/components/content/ContentNewsletter";

type Tab = "videos" | "articles" | "all";

function PlayIcon() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--green)] shadow-[var(--shadow-glow-g)] ring-4 ring-[color-mix(in_srgb,var(--green)_35%,transparent)]">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M9 7.5v9l7.5-4.5L9 7.5z"
          className="fill-[var(--on-green)]"
        />
      </svg>
    </div>
  );
}

export function ContentHubClient() {
  const [tab, setTab] = useState<Tab>("videos");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const h = window.location.hash;
    if (h === "#articles") setTab("articles");
  }, []);

  return (
    <div className="mt-12 space-y-16">
      <div className="flex flex-wrap justify-center gap-2 border-b border-[var(--border)] pb-px sm:gap-8">
        {(
          [
            ["videos", "📺 Videos"],
            ["articles", "📝 Articles"],
            ["all", "🎙️ All Content"],
          ] as const
        ).map(([id, label]) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`relative -mb-px border-b-2 px-3 py-3 text-[13px] font-semibold transition-colors ${
                active
                  ? "border-[var(--green)] text-[var(--green)]"
                  : "border-transparent text-[var(--txt-2)] hover:text-[var(--txt)]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {(tab === "videos" || tab === "all") && (
        <section id="videos-section">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--txt-3)]">
            Latest from YouTube
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VIDEOS.map((v) => (
              <div
                key={v.id}
                className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)]"
              >
                <div className="relative aspect-video overflow-hidden border-b border-[var(--border)]">
                  <div
                    className="absolute inset-0 bg-[var(--bg-card2)]"
                    aria-hidden
                  />
                  <div
                    className="absolute inset-0 bg-[color-mix(in_srgb,var(--txt)_22%,transparent)]"
                    aria-hidden
                  />
                  <div className="absolute left-2 top-2 z-10 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    {/* YouTube brand red — official logo color */}
                    <span className="rounded bg-[#ff0000] px-1.5 py-0.5">YouTube</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayIcon />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-[13px] font-bold leading-snug text-[var(--txt)]">{v.title}</h3>
                  <p className="mt-1 text-[11px] font-semibold text-[var(--green)]">{v.category}</p>
                  <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-[var(--txt-2)]">
                    {v.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--txt-3)]">
                    <span>{v.date}</span>
                    <span aria-hidden>·</span>
                    <span>{v.views}</span>
                    <span className="text-[var(--txt-muted)]">{v.duration}</span>
                  </div>
                  <a
                    href="https://www.youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--green)] hover:underline"
                  >
                    Watch Now →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {(tab === "articles" || tab === "all") && (
        <section id="articles-section">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--txt-3)]">
            Latest Articles
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {ARTICLES.map((a) => {
              const cat = a.category as ContentCategory;
              const accent = CATEGORY_ACCENT[cat];
              return (
                <Link
                  key={a.slug}
                  href={`/content/${a.slug}`}
                  className={`group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-card)] pl-5 pr-5 pt-5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] ${accent.border}`}
                >
                  <span
                    className={`inline-flex w-fit rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${accent.badge}`}
                  >
                    {a.category}
                  </span>
                  <h3 className="mt-3 text-[16px] font-extrabold leading-snug text-[var(--txt)] group-hover:underline">
                    {a.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-[var(--txt-2)]">{a.excerpt}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-4 text-[11px] text-[var(--txt-3)]">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--bg-subtle-2)] text-[10px] font-bold text-[var(--txt)]">
                      {a.author.initials}
                    </span>
                    <span className="font-medium text-[var(--txt-2)]">{a.author.name}</span>
                    <span aria-hidden>·</span>
                    <span>{a.publishedAt}</span>
                    <span aria-hidden>·</span>
                    <span>{a.readTime}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <ContentNewsletter />
    </div>
  );
}
