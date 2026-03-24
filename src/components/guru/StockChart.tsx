"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { cn } from "@/lib/utils";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend);

export type StockHistoryPoint = {
  score_date: string;
  overall_score: number | null;
  expert_score: number | null;
  fan_score: number | null;
};

type Period = "1W" | "1M" | "Season";

function sliceHistory(points: StockHistoryPoint[], period: Period): StockHistoryPoint[] {
  if (!points.length) return [];
  if (period === "Season") return points;
  if (period === "1M") return points.slice(-5);
  return points.slice(-3);
}

function labelForDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

type StockChartProps = {
  history: StockHistoryPoint[];
  className?: string;
};

export function StockChart({ history, className }: StockChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const [period, setPeriod] = useState<Period>("Season");

  const slice = useMemo(() => sliceHistory(history, period), [history, period]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const styles = getComputedStyle(document.documentElement);
    const blue = styles.getPropertyValue("--blue").trim() || "#1a6fd4";
    const orange = styles.getPropertyValue("--orange").trim() || "#d44a00";
    const green = styles.getPropertyValue("--green").trim() || "#00a854";
    const grid = styles.getPropertyValue("--grid-line").trim() || "rgba(0,0,0,0.06)";
    const txt = styles.getPropertyValue("--txt-2").trim() || "#5a5a5a";
    const cardBg = styles.getPropertyValue("--bg-card").trim() || "#ffffff";

    const labels = slice.map((p) => labelForDate(p.score_date));
    const expert = slice.map((p) => p.expert_score ?? 70);
    const fan = slice.map((p) => p.fan_score ?? 70);
    const overall = slice.map((p) => p.overall_score ?? 72);

    chartRef.current?.destroy();

    chartRef.current = new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Expert",
            data: expert,
            borderColor: blue,
            backgroundColor: blue,
            tension: 0.25,
            pointRadius: 3,
            borderWidth: 2,
            fill: false,
          },
          {
            label: "Fan",
            data: fan,
            borderColor: orange,
            backgroundColor: orange,
            tension: 0.25,
            pointRadius: 3,
            borderWidth: 2,
            fill: false,
          },
          {
            label: "Guru composite",
            data: overall,
            borderColor: green,
            backgroundColor: "rgba(0, 168, 84, 0.12)",
            tension: 0.25,
            pointRadius: 3,
            borderWidth: 2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            position: "top",
            labels: { color: txt, font: { size: 11, weight: "bold" } },
          },
          tooltip: {
            backgroundColor: cardBg,
            titleColor: txt,
            bodyColor: txt,
            borderColor: grid,
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            grid: { color: grid },
            ticks: { color: txt, maxRotation: 45, minRotation: 0 },
          },
          y: {
            min: 50,
            max: 100,
            grid: { color: grid },
            ticks: { color: txt, stepSize: 10 },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [slice]);

  const periods: Period[] = ["1W", "1M", "Season"];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap gap-2">
        {periods.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[12px] font-bold transition",
              period === p
                ? "bg-[var(--green)] text-[var(--on-green)] shadow-[var(--shadow-glow-g)]"
                : "border border-[var(--border)] bg-[var(--bg-card2)] text-[var(--txt-2)] hover:text-[var(--txt)]",
            )}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="relative h-[280px] w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-card)] p-2">
        <canvas ref={canvasRef} className="max-h-full max-w-full" />
      </div>
    </div>
  );
}
