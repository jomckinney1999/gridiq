import Link from "next/link";
import { CourseWaitlistForm } from "@/components/courses/CourseWaitlistForm";

const STAT_PILLS = [
  { label: "3 Courses" },
  { label: "50+ Datasets" },
  { label: "0 Boring Lectures" },
  { label: "∞ Football" },
] as const;

const PROJECTS = [
  {
    icon: "🗄️",
    name: "Fantasy League Analyzer",
    desc: "Query your league’s history and uncover edges with SQL.",
    accent: "var(--green)",
    bg: "var(--green-light)",
  },
  {
    icon: "🐍",
    name: "Player Projection Model",
    desc: "Train a projection pipeline on real NFL advanced stats.",
    accent: "var(--blue)",
    bg: "var(--blue-light)",
  },
  {
    icon: "📊",
    name: "NFL Data Dashboard",
    desc: "Ship interactive charts and rankings with nflverse + ggplot2.",
    accent: "var(--purple)",
    bg: "var(--purple-light)",
  },
  {
    icon: "🤖",
    name: "AI Draft Assistant",
    desc: "Blend models and LLM tooling to stress-test draft picks.",
    accent: "var(--orange)",
    bg: "var(--orange-light)",
  },
] as const;

export default function CoursesPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-10 sm:px-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--bg-card)] px-5 py-12 sm:px-10 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-[280px] w-[280px] rounded-full blur-[80px]"
          style={{
            background: "radial-gradient(circle, color-mix(in srgb, var(--orange) 18%, transparent), transparent 70%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--orange)_35%,transparent)] bg-[color-mix(in_srgb,var(--orange)_10%,transparent)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--orange)]">
            Coming Soon
          </div>
          <h1 className="mt-6 text-balance text-[32px] font-extrabold tracking-[-1px] text-[var(--txt)] sm:text-[44px]">
            Learn to Code{" "}
            <span className="bg-gradient-to-r from-[var(--green)] via-[var(--blue)] to-[var(--orange)] bg-clip-text text-transparent">
              Through Football
            </span>
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-[var(--txt-2)]">
            Master SQL, Python, and R by building real fantasy football apps, exploring NFL data, and creating
            analytics tools you&apos;ll actually use. No boring textbooks — just football.
          </p>

          <div id="waitlist" className="mx-auto mt-10 flex justify-center scroll-mt-28">
            <CourseWaitlistForm />
          </div>

          <div className="mx-auto mt-10 flex max-w-xl flex-wrap items-center justify-center gap-2">
            {STAT_PILLS.map((p) => (
              <span
                key={p.label}
                className="rounded-full border border-[var(--border)] bg-[var(--bg-card2)] px-3 py-1.5 text-[12px] font-semibold text-[var(--txt-2)]"
              >
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Courses grid */}
      <section className="mt-16">
        <h2 className="text-center text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--txt-3)]">
          Courses
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-[22px] font-extrabold tracking-[-0.5px] text-[var(--txt)]">
          What you can learn
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* SQL */}
          <article className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)]">
            <div className="flex items-center gap-3 bg-[var(--green-light)] px-5 py-4">
              <span className="text-2xl" aria-hidden>
                🗄️
              </span>
              <span className="text-[12px] font-bold uppercase tracking-wide text-[var(--green)]">
                Course 01 · SQL
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-[18px] font-extrabold leading-snug text-[var(--txt)]">
                Fantasy Football SQL Bootcamp
              </h3>
              <p className="mt-3 flex-1 text-[13px] leading-relaxed text-[var(--txt-2)]">
                Learn SQL by building a fantasy football database from scratch. Query real NFL stats, find waiver wire
                gems, and build a league analyzer — all with live data.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["SQL", "PostgreSQL", "Fantasy Football", "Beginner Friendly"].map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-[var(--border)] bg-[var(--bg-card2)] px-2 py-0.5 text-[10px] font-semibold text-[var(--txt-2)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5 text-[15px] font-bold text-[var(--txt)]">$49 / lifetime access</div>
              <Link
                href="#waitlist"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-xl border border-[var(--border-md)] bg-transparent px-4 text-[13px] font-semibold text-[var(--txt)] transition hover:border-[var(--green-border)] hover:bg-[var(--green-light)] hover:text-[var(--green)]"
              >
                Notify Me
              </Link>
            </div>
          </article>

          {/* Python */}
          <article className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)]">
            <div className="flex items-center gap-3 bg-[var(--blue-light)] px-5 py-4">
              <span className="text-2xl" aria-hidden>
                🐍
              </span>
              <span className="text-[12px] font-bold uppercase tracking-wide text-[var(--blue)]">
                Course 02 · Python
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-[18px] font-extrabold leading-snug text-[var(--txt)]">
                NFL Analytics with Python
              </h3>
              <p className="mt-3 flex-1 text-[13px] leading-relaxed text-[var(--txt-2)]">
                Build a full fantasy football projection model in Python using pandas, nfl_data_py, and real advanced
                stats. Ship a working app by the end.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["Python", "pandas", "Data Analysis", "ML Intro"].map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-[var(--border)] bg-[var(--bg-card2)] px-2 py-0.5 text-[10px] font-semibold text-[var(--txt-2)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5 text-[15px] font-bold text-[var(--txt)]">$69 / lifetime access</div>
              <Link
                href="#waitlist"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-xl border border-[var(--border-md)] bg-transparent px-4 text-[13px] font-semibold text-[var(--txt)] transition hover:border-[color-mix(in_srgb,var(--blue)_40%,transparent)] hover:bg-[var(--blue-light)] hover:text-[var(--blue)]"
              >
                Notify Me
              </Link>
            </div>
          </article>

          {/* R */}
          <article className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)]">
            <div className="flex items-center gap-3 bg-[var(--purple-light)] px-5 py-4">
              <span className="text-2xl" aria-hidden>
                📊
              </span>
              <span className="text-[12px] font-bold uppercase tracking-wide text-[var(--purple)]">
                Course 03 · R
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-[18px] font-extrabold leading-snug text-[var(--txt)]">
                Sports Data Viz with R
              </h3>
              <p className="mt-3 flex-1 text-[13px] leading-relaxed text-[var(--txt-2)]">
                Create stunning NFL data visualizations using ggplot2 and nflverse. Build dashboards, win probability
                charts, and player comparison tools.
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["R", "ggplot2", "Data Viz", "nflverse"].map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-[var(--border)] bg-[var(--bg-card2)] px-2 py-0.5 text-[10px] font-semibold text-[var(--txt-2)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5 text-[15px] font-bold text-[var(--txt)]">$59 / lifetime access</div>
              <Link
                href="#waitlist"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-xl border border-[var(--border-md)] bg-transparent px-4 text-[13px] font-semibold text-[var(--txt)] transition hover:border-[color-mix(in_srgb,var(--purple)_40%,transparent)] hover:bg-[var(--purple-light)] hover:text-[var(--purple)]"
              >
                Notify Me
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* What you'll build */}
      <section className="mt-20">
        <h2 className="text-center text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--txt-3)]">
          What you&apos;ll build
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-[22px] font-extrabold tracking-[-0.5px] text-[var(--txt)]">
          Real projects, not toy examples
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PROJECTS.map((p) => (
            <div
              key={p.name}
              className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-sm)]"
            >
              <div
                className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-xl"
                style={{ background: p.bg, color: p.accent }}
                aria-hidden
              >
                {p.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-[15px] font-bold text-[var(--txt)]">{p.name}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-[var(--txt-2)]">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instructor */}
      <section className="mt-20 overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--bg-card2)] px-5 py-12 sm:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <div
            className="mx-auto grid h-20 w-20 place-items-center rounded-full text-[22px] font-extrabold text-[var(--on-green)] shadow-[var(--shadow-md)]"
            style={{
              background: "linear-gradient(135deg, var(--green), var(--blue))",
            }}
            aria-hidden
          >
            NS
          </div>
          <p className="mt-6 text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--txt-3)]">
            Your Instructor
          </p>
          <h2 className="mt-2 text-[20px] font-extrabold tracking-[-0.5px] text-[var(--txt)] sm:text-[24px]">
            Business Analytics Professional &amp; NFL Stat Guru Founder
          </h2>
          <p className="mt-5 text-[14px] leading-relaxed text-[var(--txt-2)]">
            8+ years delivering data and AI solutions across Fortune 500 healthcare, higher education, and startups.
            Built NFL Stat Guru from scratch — including the Python ETL pipeline, PostgreSQL schema, and AI query engine
            powering this platform. Now teaching everything I know through football.
          </p>
          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2">
            {[
              "8+ Years Analytics",
              "Python",
              "SQL",
              "R",
              "Fortune 500 Experience",
              "AI/LLM Builder",
              "NFL Stat Guru Founder",
            ].map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 text-[11px] font-semibold text-[var(--txt-2)]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
