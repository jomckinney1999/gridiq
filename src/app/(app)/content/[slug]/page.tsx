import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, getArticleBySlug, relatedArticles } from "@/lib/content/articles";
import type { ArticleBlock } from "@/lib/content/articles";
import { CATEGORY_ACCENT } from "@/lib/content/categories";
import type { ContentCategory } from "@/lib/content/categories";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="article-prose space-y-6">
      {blocks.map((b, i) => {
        if (b.type === "p") {
          return (
            <p key={i} className="text-[16px] leading-[1.8] text-[var(--txt-2)]">
              {b.text}
            </p>
          );
        }
        if (b.type === "h2") {
          return (
            <h2 key={i} className="pt-2 text-[22px] font-bold text-[var(--txt)]">
              {b.text}
            </h2>
          );
        }
        if (b.type === "blockquote") {
          return (
            <blockquote
              key={i}
              className="border-l-4 border-[var(--green)] pl-4 text-[16px] italic leading-[1.8] text-[var(--txt-3)]"
            >
              {b.text}
            </blockquote>
          );
        }
        if (b.type === "code") {
          return (
            <pre
              key={i}
              className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-card2)] p-4 font-mono text-[13px] leading-relaxed text-[var(--txt-2)]"
            >
              <code>{b.text}</code>
            </pre>
          );
        }
        return null;
      })}
    </div>
  );
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const cat = article.category as ContentCategory;
  const accent = CATEGORY_ACCENT[cat];
  const related = relatedArticles(slug, 3);

  return (
    <div className="mx-auto w-full max-w-[680px] px-4 pb-20 pt-10 sm:px-6">
      <Link
        href="/content"
        className="inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--txt-2)] transition hover:text-[var(--green)]"
      >
        ← Back to Content
      </Link>

      <article className="mt-8">
        <h1 className="text-[28px] font-black leading-tight tracking-[-1px] text-[var(--txt)] sm:text-[32px]">
          {article.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-[var(--txt-3)]">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${accent.badge}`}
          >
            {article.category}
          </span>
          <span>{article.publishedAt}</span>
          <span aria-hidden>·</span>
          <span>{article.readTime}</span>
        </div>
        <div className="mt-8 flex items-center gap-3 border-b border-[var(--border)] pb-8">
          <div
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[13px] font-bold text-[var(--on-green)]"
            style={{
              background: "linear-gradient(135deg, var(--green), var(--blue))",
            }}
          >
            {article.author.initials}
          </div>
          <div>
            <div className="text-[14px] font-semibold text-[var(--txt)]">{article.author.name}</div>
            <div className="text-[12px] text-[var(--txt-3)]">NFL Stat Guru</div>
          </div>
        </div>

        <div className="mt-10">
          <ArticleBody blocks={article.blocks} />
        </div>
      </article>

      {related.length > 0 ? (
        <section className="mt-16 border-t border-[var(--border)] pt-12">
          <h2 className="text-[18px] font-extrabold text-[var(--txt)]">Related Articles</h2>
          <ul className="mt-6 space-y-4">
            {related.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/content/${a.slug}`}
                  className="group block rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 transition hover:border-[var(--border-md)] hover:shadow-[var(--shadow-sm)]"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--txt-3)]">
                    {a.category}
                  </span>
                  <p className="mt-1 text-[15px] font-bold text-[var(--txt)] group-hover:text-[var(--green)] group-hover:underline">
                    {a.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[13px] text-[var(--txt-2)]">{a.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
