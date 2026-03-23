import { NextRequest, NextResponse } from "next/server";
import { getMockTrending } from "@/lib/trending/mock-data";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ team: string }> },
) {
  const { team: raw } = await context.params;
  const team = decodeURIComponent(raw ?? "ALL");
  const data = getMockTrending(team);
  return NextResponse.json(data);
}
