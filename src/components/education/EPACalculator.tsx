"use client";

import { useMemo, useState } from "react";

type Down = 1 | 2 | 3 | 4;
type DistanceKey = 1 | 3 | 5 | 7 | 10 | 15;

const DOWNS: Down[] = [1, 2, 3, 4];
const DISTANCES: DistanceKey[] = [1, 3, 5, 7, 10, 15];

function baseEPFromYtg(ytg: number): number {
  if (ytg <= 5) return 6.0;
  if (ytg <= 10) return 5.5;
  if (ytg <= 20) return 4.8;
  if (ytg <= 30) return 4.0;
  if (ytg <= 40) return 3.2;
  if (ytg <= 50) return 2.6;
  if (ytg <= 60) return 2.0;
  if (ytg <= 70) return 1.4;
  if (ytg <= 80) return 0.8;
  if (ytg <= 90) return 0.3;
  return -0.1;
}

function downAdj(down: Down): number {
  switch (down) {
    case 1:
      return 0;
    case 2:
      return -0.3;
    case 3:
      return -0.7;
    case 4:
      return -1.1;
    default:
      return 0;
  }
}

function distanceAdj(d: DistanceKey): number {
  switch (d) {
    case 1:
      return 0.4;
    case 3:
      return 0.2;
    case 5:
      return 0;
    case 7:
      return -0.1;
    case 10:
      return -0.2;
    case 15:
      return -0.5;
    default:
      return 0;
  }
}

/** yardline: 1 = own 1, 99 = opponent 1; ytg = yards to opponent goal */
function calcEP(yardline: number, down: Down, distance: DistanceKey): number {
  const ytg = 100 - yardline;
  const raw = baseEPFromYtg(ytg) + downAdj(down) + distanceAdj(distance);
  return Math.round(raw * 10) / 10;
}

function calcEPFromYtg(ytg: number, down: Down, distance: DistanceKey): number {
  const raw = baseEPFromYtg(ytg) + downAdj(down) + distanceAdj(distance);
  return Math.round(raw * 10) / 10;
}

function formatEPA(n: number): string {
  const rounded = Math.round(n * 100) / 100;
  const sign = rounded > 0 ? "+" : "";
  return `${sign}${rounded.toFixed(2)}`;
}

type PlayId =
  | "td"
  | "big"
  | "fd"
  | "short"
  | "nogain"
  | "loss"
  | "int"
  | "fumble";

type PlayDef = {
  id: PlayId;
  name: string;
  yardsNote: string;
  emoji: string;
  tone: "good" | "bad" | "turnover";
};

const PLAYS: PlayDef[] = [
  { id: "td", name: "Touchdown", yardsNote: "+6 pts (+XP)", emoji: "🏈", tone: "good" },
  { id: "big", name: "Big Gain", yardsNote: "+20 yds", emoji: "💨", tone: "good" },
  { id: "fd", name: "First Down", yardsNote: "+12 yds", emoji: "➡️", tone: "good" },
  { id: "short", name: "Short Gain", yardsNote: "+4 yds", emoji: "📌", tone: "good" },
  { id: "nogain", name: "No Gain", yardsNote: "0 yds", emoji: "🧱", tone: "bad" },
  { id: "loss", name: "Loss of Yards", yardsNote: "−5 yds", emoji: "⬇️", tone: "bad" },
  { id: "int", name: "Interception", yardsNote: "Turnover", emoji: "🔄", tone: "turnover" },
  { id: "fumble", name: "Fumble Lost", yardsNote: "Turnover", emoji: "💢", tone: "turnover" },
];

const segActive =
  "border-[rgba(0,255,135,0.3)] bg-[rgba(0,255,135,0.12)] text-[#00ff87]";
const segIdle =
  "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-[#8888a0] hover:border-[rgba(255,255,255,0.12)]";

function fieldLabels(): { pct: number; text: string }[] {
  return [
    { pct: 0, text: "Opp 1" },
    { pct: 25, text: "Opp 25" },
    { pct: 50, text: "50" },
    { pct: 75, text: "Own 25" },
    { pct: 100, text: "Own 1" },
  ];
}

/** Marker: yardline 99 = Opp 1 (left 0%), yardline 1 = Own 1 (right 100%) */
function markerLeftPct(yardline: number): number {
  return ((99 - yardline) / 98) * 100;
}

function situationalPlainEnglish(yardline: number, down: Down, dist: DistanceKey): string {
  const ytg = 100 - yardline;
  const field =
    ytg <= 10
      ? "inside the 10 — touchdown territory"
      : ytg <= 25
        ? "in the red zone"
        : ytg <= 45
          ? "in scoring range"
          : ytg <= 65
            ? "around midfield"
            : ytg <= 85
              ? "on your side of the field"
              : "backed up deep";

  const downPhrase =
    down === 1
      ? "1st down — four chances to move the sticks"
      : down === 2
        ? "2nd down — the down where drives stay on schedule or start to wobble"
        : down === 3
          ? "3rd down — money down; distance matters a lot"
          : "4th down — go-for-it, kick, or punt territory";

  const distPhrase =
    dist <= 3
      ? "short yardage"
      : dist <= 7
        ? "medium distance"
        : dist <= 10
          ? "a full first down to go"
          : "long distance — hard to convert";

  return `You're ${field} (${ytg} yards to the goal), facing ${downPhrase} with ${distPhrase} (${dist === 15 ? "15+" : dist} yards to go).`;
}

function contextForEP(ep: number, ytg: number): string {
  if (ep >= 5) {
    return "That's a huge scoring expectation — you're knocking on the door. The model thinks this possession is worth roughly a touchdown drive from here.";
  }
  if (ep >= 3) {
    return "Strong field position: on average, teams in this spot tend to put points on the board soon. The number is the model's best guess for how many points this drive is 'worth' before the snap.";
  }
  if (ep >= 1) {
    return "About a field goal's worth of expectation — not automatic, but you're in business. Small swings in field position or down/distance move this number more than you might expect.";
  }
  if (ep > 0) {
    return "Slim positive expectation: scoring isn't likely yet, but you're not starting underwater. First downs and chunk plays are what push this up fast.";
  }
  if (ep > -0.5) {
    return "Roughly break-even territory for this snap — the situation is tough enough that the average drive doesn't reliably produce points from here.";
  }
  return "Backed up or behind the chains: the model expects very little from this drive unless you flip field position. That's why explosive plays and hidden yards matter so much.";
}

type SimResult = {
  epBefore: number;
  epAfter: number;
  epa: number;
  headline: string;
  explanation: string;
  playId: PlayId;
};

function simulatePlay(
  playId: PlayId,
  yardline: number,
  down: Down,
  dist: DistanceKey,
): SimResult {
  const epBefore = calcEP(yardline, down, dist);

  if (playId === "td") {
    const epAfter = 0.5;
    const epa = Math.round((7 + epAfter - epBefore) * 100) / 100;
    return {
      epBefore,
      epAfter,
      epa,
      playId,
      headline: "Touchdown — maximum outcome",
      explanation:
        "You bank the six (plus the PAT attempt). EPA credits the touchdown and the tiny value of the next possession starting roughly around a kickoff situation.",
    };
  }

  if (playId === "int" || playId === "fumble") {
    const oppEP = calcEPFromYtg(yardline, 1, 10);
    const epAfter = Math.round(-oppEP * 10) / 10;
    const epa = Math.round((epAfter - epBefore) * 100) / 100;
    const label = playId === "int" ? "Interception" : "Fumble lost";
    return {
      epBefore,
      epAfter,
      epa,
      playId,
      headline: `${label} — possession flips`,
      explanation:
        "Turnovers swing the scoreboard expectation hard: we subtract what the opponent would expect to score from that spot (1st & 10 for them), which shows up as a big negative swing for your offense.",
    };
  }

  const yardsMap: Record<Exclude<PlayId, "td" | "int" | "fumble">, number> = {
    big: 20,
    fd: 12,
    short: 4,
    nogain: 0,
    loss: -5,
  };
  const yds = yardsMap[playId as keyof typeof yardsMap];

  if (yds > 0) {
    const raw = yardline + yds;
    if (raw >= 100) {
      const epAfter = 0.5;
      const epa = Math.round((7 + epAfter - epBefore) * 100) / 100;
      return {
        epBefore,
        epAfter,
        epa,
        playId,
        headline: "End zone — that's six",
        explanation:
          "The gain reaches the goal line. We treat it like a touchdown for EPA: seven points on the scoreboard plus the small residual value of the upcoming kickoff spot.",
      };
    }
    const newLine = Math.min(99, raw);
    const epAfter = calcEP(newLine, 1, 10);
    const epa = Math.round((epAfter - epBefore) * 100) / 100;
    return {
      epBefore,
      epAfter,
      epa,
      playId,
      headline: "Positive play — fresh set of downs",
      explanation:
        "We move the ball and reset to 1st & 10 at the new yard line. EPA is simply the new expected points minus what you had before the snap.",
    };
  }

  if (yds === 0) {
    const nextDown = Math.min(4, down + 1) as Down;
    const epAfter = calcEP(yardline, nextDown, dist);
    const epa = Math.round((epAfter - epBefore) * 100) / 100;
    return {
      epBefore,
      epAfter,
      epa,
      playId,
      headline: "Stuffed — clock moves, situation worsens",
      explanation:
        "No field progress, but the down advances. Expected points drop because you burned a down without gaining toward the goal.",
    };
  }

  const newLine = Math.max(1, yardline - 5);
  const nextDown = Math.min(4, down + 1) as Down;
  const epAfter = calcEP(newLine, nextDown, dist);
  const epa = Math.round((epAfter - epBefore) * 100) / 100;
  return {
    epBefore,
    epAfter,
    epa,
    playId,
    headline: "Tackled in the backfield",
    explanation:
      "You lose five yards and move one down closer to punting or a desperate conversion. EPA captures both the lost field position and the worse down.",
  };
}

export function EPACalculator() {
  const [yardline, setYardline] = useState(75);
  const [down, setDown] = useState<Down>(2);
  const [distance, setDistance] = useState<DistanceKey>(7);
  const [selectedPlay, setSelectedPlay] = useState<PlayId | null>(null);

  const ep = useMemo(() => calcEP(yardline, down, distance), [yardline, down, distance]);
  const ytg = 100 - yardline;

  const sim = useMemo(() => {
    if (!selectedPlay) return null;
    return simulatePlay(selectedPlay, yardline, down, distance);
  }, [selectedPlay, yardline, down, distance]);

  const plainEnglish = useMemo(
    () => situationalPlainEnglish(yardline, down, distance),
    [yardline, down, distance],
  );
  const contextText = useMemo(() => contextForEP(ep, ytg), [ep, ytg]);

  return (
    <div
      className="mx-auto mt-8 max-w-6xl rounded-[14px] border border-[rgba(255,255,255,0.12)] bg-[#0d0d10] p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.4)] sm:p-7"
      aria-label="Expected Points calculator"
    >
      <style>{`
        .epa-calc-range {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.08);
          outline: none;
          transition: box-shadow 0.25s ease;
        }
        .epa-calc-range:focus-visible {
          box-shadow: 0 0 0 2px rgba(0,255,135,0.35);
        }
        .epa-calc-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #00ff87;
          border: 2px solid rgba(0,255,135,0.5);
          box-shadow: 0 0 14px rgba(0,255,135,0.65), 0 0 28px rgba(0,255,135,0.25);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .epa-calc-range::-webkit-slider-thumb:hover {
          transform: scale(1.06);
        }
        .epa-calc-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #00ff87;
          border: 2px solid rgba(0,255,135,0.5);
          box-shadow: 0 0 14px rgba(0,255,135,0.65);
          cursor: pointer;
        }
        .epa-calc-range::-moz-range-track {
          height: 6px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.08);
        }
      `}</style>

      {/* Header */}
      <div
        className="-mx-5 -mt-5 mb-6 rounded-t-[14px] border-b border-[rgba(255,255,255,0.06)] px-5 pb-5 pt-5 sm:-mx-7 sm:-mt-7 sm:px-7 sm:pt-7"
        style={{
          background: "linear-gradient(180deg, rgba(0,255,135,0.06) 0%, transparent 100%)",
        }}
      >
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#00ff87]">
          Interactive Calculator
        </div>
        <h2 className="mt-2 text-[20px] font-extrabold tracking-[-0.5px] text-[#f2f2f5]">
          Expected Points (EP) Calculator
        </h2>
      </div>

      {/* Section 1 */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="flex flex-col gap-6 transition-opacity duration-300">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#44445a]">
              Down
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {DOWNS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDown(d)}
                  className={`rounded-lg border px-2 py-2.5 text-[12px] font-bold uppercase tracking-wide transition-all duration-300 ${
                    down === d ? segActive : segIdle
                  }`}
                >
                  {d === 1 ? "1st" : d === 2 ? "2nd" : d === 3 ? "3rd" : "4th"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#44445a]">
              Distance to go
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {DISTANCES.map((dist) => (
                <button
                  key={dist}
                  type="button"
                  onClick={() => setDistance(dist)}
                  className={`rounded-lg border px-2 py-2.5 text-[12px] font-bold transition-all duration-300 ${
                    distance === dist ? segActive : segIdle
                  }`}
                >
                  {dist === 15 ? "15+" : dist}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#44445a]">
                Field position
              </span>
              <span className="tabular-nums text-[13px] font-semibold text-[#00ff87] transition-all duration-300">
                Yardline {yardline}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={99}
              value={yardline}
              onChange={(e) => setYardline(Number(e.target.value))}
              className="epa-calc-range mt-3"
              aria-label="Field position yard line"
            />
            <div className="relative mt-3 overflow-hidden rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#08080a]">
              <div className="relative flex h-12 w-full">
                <div
                  className="h-full w-[8%] shrink-0 bg-[#ff6b2b]"
                  style={{ opacity: 0.85 }}
                  aria-hidden
                />
                <div className="h-full flex-1 bg-[#12121a]" aria-hidden />
                <div
                  className="h-full w-[8%] shrink-0 bg-[#00ff87]"
                  style={{ opacity: 0.35 }}
                  aria-hidden
                />
              </div>
              <div
                className="pointer-events-none absolute bottom-0 top-0 w-0.5 bg-[#00ff87] shadow-[0_0_12px_rgba(0,255,135,0.9)] transition-[left] duration-300 ease-out"
                style={{
                  left: `calc(${8 + (markerLeftPct(yardline) / 100) * 84}%)`,
                  transform: "translateX(-50%)",
                }}
              />
            </div>
            <div className="relative mt-2 h-4 text-[10px] font-semibold text-[#66667a]">
              {fieldLabels().map(({ pct, text }) => (
                <span
                  key={text}
                  className="absolute -translate-x-1/2 whitespace-nowrap transition-colors duration-300"
                  style={{ left: `${pct}%` }}
                >
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div
            className="flex flex-col items-center justify-center rounded-xl border border-[rgba(0,255,135,0.2)] bg-[rgba(0,255,135,0.06)] px-6 py-8 transition-all duration-300"
          >
            <div className="text-center text-[10px] font-bold uppercase tracking-[0.14em] text-[#00ff87]">
              Expected Points
            </div>
            <div
              className="mt-2 text-center text-[48px] font-black tabular-nums tracking-[-2px] text-[#00ff87] transition-all duration-300"
              style={{
                textShadow: "0 0 28px rgba(0,255,135,0.45), 0 0 60px rgba(0,255,135,0.2)",
              }}
            >
              {ep.toFixed(1)}
            </div>
            <div className="mt-2 max-w-[260px] text-center text-[12px] leading-snug text-[#8888a0]">
              points expected to score this drive
            </div>
          </div>

          <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#08080a] p-4 text-[14px] leading-relaxed text-[#c8c8d4] transition-all duration-300">
            {contextText}
          </div>

          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4 text-[14px] leading-relaxed text-[#f2f2f5] transition-all duration-300">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#44445a]">
              Situation
            </span>
            <p className="mt-2">{plainEnglish}</p>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="mt-10 border-t border-[rgba(255,255,255,0.08)] pt-8">
        <h3 className="text-[16px] font-extrabold tracking-[-0.3px] text-[#f2f2f5]">
          Play Simulator — What happens if…
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PLAYS.map((p) => {
            const sel = selectedPlay === p.id;
            const toneRing =
              p.tone === "good"
                ? sel
                  ? "border-[rgba(0,255,135,0.45)] bg-[rgba(0,255,135,0.1)]"
                  : ""
                : p.tone === "bad"
                  ? sel
                    ? "border-[rgba(255,107,43,0.5)] bg-[rgba(255,107,43,0.12)]"
                    : ""
                  : sel
                    ? "border-[rgba(255,80,80,0.55)] bg-[rgba(255,80,80,0.1)]"
                    : "";
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPlay(p.id)}
                className={`group flex flex-col items-start gap-1 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#08080a] p-3 text-left transition-all duration-300 hover:border-[rgba(255,255,255,0.14)] ${toneRing}`}
              >
                <span className="text-[22px] leading-none transition-transform duration-300 group-hover:scale-105">
                  {p.emoji}
                </span>
                <span className="text-[13px] font-bold text-[#f2f2f5]">{p.name}</span>
                <span className="text-[11px] text-[#66667a]">{p.yardsNote}</span>
              </button>
            );
          })}
        </div>

        {sim && (
          <div className="mt-6 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#08080a] p-5 transition-all duration-500">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div
                className={`text-[40px] font-black tabular-nums tracking-[-1px] transition-colors duration-300 ${
                  sim.epa >= 0 ? "text-[#00ff87]" : "text-[#ff5a5a]"
                }`}
                style={
                  sim.epa >= 0
                    ? { textShadow: "0 0 24px rgba(0,255,135,0.35)" }
                    : { textShadow: "0 0 24px rgba(255,90,90,0.35)" }
                }
              >
                {formatEPA(sim.epa)}
              </div>
              <div className="max-w-xl flex-1">
                <div className="text-[16px] font-bold text-[#f2f2f5]">{sim.headline}</div>
                <p className="mt-2 text-[14px] leading-relaxed text-[#8888a0]">{sim.explanation}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-stretch gap-3">
              <div className="min-w-[100px] flex-1 rounded-lg border border-[rgba(255,107,43,0.25)] bg-[rgba(255,107,43,0.08)] px-4 py-3 transition-all duration-300">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#ff6b2b]">
                  Before
                </div>
                <div className="mt-1 text-[22px] font-black tabular-nums text-[#ff6b2b]">
                  {sim.epBefore.toFixed(1)}
                </div>
              </div>
              <div className="flex items-center text-[#44445a]">→</div>
              <div className="min-w-[100px] flex-1 rounded-lg border border-[rgba(0,255,135,0.25)] bg-[rgba(0,255,135,0.08)] px-4 py-3 transition-all duration-300">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#00ff87]">
                  After
                </div>
                <div className="mt-1 text-[22px] font-black tabular-nums text-[#00ff87]">
                  {sim.epAfter.toFixed(1)}
                </div>
              </div>
              <div
                className={`flex min-w-[120px] items-center justify-center rounded-full border px-4 py-2 text-[13px] font-extrabold tabular-nums transition-all duration-300 ${
                  sim.epa >= 0
                    ? "border-[rgba(0,255,135,0.35)] bg-[rgba(0,255,135,0.15)] text-[#00ff87]"
                    : "border-[rgba(255,90,90,0.4)] bg-[rgba(255,90,90,0.12)] text-[#ff5a5a]"
                }`}
              >
                EPA {formatEPA(sim.epa)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
