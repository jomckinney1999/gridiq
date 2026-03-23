"use client";

import { TrendingPageClient } from "@/components/trending/TrendingPageClient";
import { useParams } from "next/navigation";

export default function TeamTrendingPage() {
  const params = useParams();
  const raw = params.team;
  const team = typeof raw === "string" ? raw : "ALL";
  return <TrendingPageClient teamParam={team} />;
}
