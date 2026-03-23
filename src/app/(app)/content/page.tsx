import Link from "next/link";
import { ContentHubClient } from "@/components/content/ContentHubClient";

export default function ContentPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-8 pt-10 sm:px-6">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--green)]">Content</p>
        <h1 className="mt-3 text-[36px] font-extrabold tracking-[-1px] text-[var(--txt)] sm:text-[44px]">
          Film Room
        </h1>
        <p className="mt-2 text-[18px] font-semibold sm:text-[20px]">
          <span className="bg-gradient-to-r from-[var(--green)] via-[var(--blue)] to-[var(--orange)] bg-clip-text text-transparent">
            By NFL Stat Guru
          </span>
        </p>
        <p className="mt-5 text-[15px] leading-relaxed text-[var(--txt-2)]">
          Film breakdowns, fantasy analysis, advanced stats explained, and NFL deep dives — on YouTube and right here.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-full max-w-[280px] items-center justify-center rounded-xl px-5 text-[13px] font-semibold text-white transition hover:brightness-110 sm:w-auto"
            style={{ backgroundColor: "#ff0000" }}
          >
            Subscribe on YouTube
          </a>
          <Link
            href="/content#articles"
            className="inline-flex h-11 w-full max-w-[280px] items-center justify-center rounded-xl border border-[var(--border-md)] bg-transparent px-5 text-[13px] font-semibold text-[var(--txt)] transition hover:border-[var(--green-border)] hover:bg-[var(--green-light)] hover:text-[var(--green)] sm:w-auto"
          >
            Read Latest Articles →
          </Link>
        </div>
      </header>

      <ContentHubClient />
    </div>
  );
}
