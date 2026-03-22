import Anthropic from "@anthropic-ai/sdk";
import { GRIDIQ_SYSTEM_PROMPT } from "@/lib/ai/systemPrompt";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

const client = new Anthropic();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function queryDatabase(entities: any, intent: string) {
  try {
    const playerName = entities?.player;
    if (!playerName) return null;

    console.log("Searching for player:", playerName);

    // Find player with fuzzy name match
    const { data: players, error: playerError } = await supabase
      .from("players")
      .select("id, name, position, team")
      .ilike("name", `%${playerName}%`)
      .limit(3);

    console.log("Players found:", players, playerError);

    if (!players?.length) return null;
    const player = players[0];
    const season = entities?.season || 2024;

    // SEASON TOTALS
    const { data: stats, error: statsError } = await supabase
      .from("player_game_stats")
      .select("*")
      .eq("player_id", player.id)
      .eq("season", season);

    console.log(`Stats for ${player.name}:`, stats?.length, "rows", statsError);

    if (!stats?.length) return { player, stats: null, season };

    // Aggregate all weeks into season totals
    const totals = stats.reduce(
      (acc: any, game: any) => ({
        receptions: (acc.receptions || 0) + (game.receptions || 0),
        rec_yards: (acc.rec_yards || 0) + (game.rec_yards || 0),
        rec_tds: (acc.rec_tds || 0) + (game.rec_tds || 0),
        targets: (acc.targets || 0) + (game.targets || 0),
        carries: (acc.carries || 0) + (game.carries || 0),
        rush_yards: (acc.rush_yards || 0) + (game.rush_yards || 0),
        rush_tds: (acc.rush_tds || 0) + (game.rush_tds || 0),
        completions: (acc.completions || 0) + (game.completions || 0),
        attempts: (acc.attempts || 0) + (game.attempts || 0),
        pass_yards: (acc.pass_yards || 0) + (game.pass_yards || 0),
        pass_tds: (acc.pass_tds || 0) + (game.pass_tds || 0),
        interceptions: (acc.interceptions || 0) + (game.interceptions || 0),
        fumbles: (acc.fumbles || 0) + (game.fumbles || 0),
        games_played: (acc.games_played || 0) + 1,
      }),
      {},
    );

    // Week-specific lookup
    let weekStats = null;
    if (entities?.week) {
      weekStats = stats.filter((s: any) => s.week === entities.week);
    }

    // Playoff stats (weeks 19+)
    let playoffStats = null;
    if (entities?.game_type === "playoffs") {
      const playoffRows = stats.filter((s: any) => s.week >= 19);
      if (playoffRows.length) {
        playoffStats = playoffRows.reduce(
          (acc: any, game: any) => ({
            fumbles: (acc.fumbles || 0) + (game.fumbles || 0),
            pass_yards: (acc.pass_yards || 0) + (game.pass_yards || 0),
            pass_tds: (acc.pass_tds || 0) + (game.pass_tds || 0),
            rec_yards: (acc.rec_yards || 0) + (game.rec_yards || 0),
            games_played: (acc.games_played || 0) + 1,
          }),
          {},
        );
      }
    }

    return {
      player,
      season,
      totals,
      weekStats,
      playoffStats,
      rawStats: stats,
      gamesPlayed: stats.length,
    };
  } catch (error) {
    console.error("DB error:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { query, conversationHistory = [] } = await req.json();

    if (!query?.trim()) {
      return Response.json({ error: "Query required" }, { status: 400 });
    }

    console.log("Processing query:", query);

    // Step 1: Parse intent with Claude
    const parseMessages = [...conversationHistory, { role: "user" as const, content: query }];

    const parseResponse = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: GRIDIQ_SYSTEM_PROMPT,
      messages: parseMessages,
    });

    const rawText =
      parseResponse.content[0].type === "text" ? parseResponse.content[0].text : "";

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const parsed = JSON.parse(jsonMatch[0]);
    console.log("Parsed intent:", parsed.intent, "entities:", parsed.entities);

    // Step 2: Query real database
    const dbData = await queryDatabase(parsed.entities, parsed.intent);
    console.log("DB data found:", !!dbData, dbData?.player?.name);

    // Step 3: Format response with real data
    let finalResponse = parsed;

    if (dbData?.totals || dbData?.weekStats || dbData?.playoffStats) {
      const formatPrompt = `
User asked: "${query}"

Real NFL database results:
Player: ${dbData.player.name} (${dbData.player.position}, ${dbData.player.team})
Season: ${dbData.season}
${dbData.playoffStats ? `Playoff stats: ${JSON.stringify(dbData.playoffStats)}` : ""}
${dbData.weekStats?.length ? `Week ${parsed.entities?.week} stats: ${JSON.stringify(dbData.weekStats)}` : ""}
${dbData.totals ? `Season totals: ${JSON.stringify(dbData.totals)}` : ""}
Games played: ${dbData.gamesPlayed}

Write a 2-3 sentence answer using ONLY these real numbers.
Bold key numbers with **.
Return JSON:
{
  "response_text": "...",
  "key_stats": [
    {"label": "STAT NAME", "value": "123", "sub": "context", "accent": "green"}
  ],
  "table_data": null
}
      `;

      const formatResponse = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 512,
        messages: [{ role: "user", content: formatPrompt }],
      });

      const formatText =
        formatResponse.content[0].type === "text" ? formatResponse.content[0].text : "";

      const formatJson = formatText.match(/\{[\s\S]*\}/);
      if (formatJson) {
        const formatted = JSON.parse(formatJson[0]);
        finalResponse = {
          ...parsed,
          ...formatted,
          dbData,
        };
      }
    }

    return Response.json({
      ...finalResponse,
      conversationHistory: [...parseMessages, { role: "assistant", content: rawText }],
    });
  } catch (error) {
    console.error("Query error:", error);
    return Response.json(
      { error: "Failed to process query", details: String(error) },
      { status: 500 },
    );
  }
}
