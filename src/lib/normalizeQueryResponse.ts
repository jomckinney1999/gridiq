import type { GridIQAPIResponse } from "@/types/gridiq-query";

export function normalizeQueryResponse(data: Record<string, unknown>): GridIQAPIResponse {
  return {
    intent: String(data.intent ?? "general"),
    entities: (data.entities as GridIQAPIResponse["entities"]) ?? {},
    display_type: String(data.display_type ?? "general"),
    response_text: String(data.response_text ?? ""),
    key_stats: Array.isArray(data.key_stats) ? (data.key_stats as GridIQAPIResponse["key_stats"]) : [],
    table_data: (data.table_data as GridIQAPIResponse["table_data"]) ?? null,
    follow_up_suggestions: Array.isArray(data.follow_up_suggestions)
      ? (data.follow_up_suggestions as string[])
      : [],
    rawText: typeof data.rawText === "string" ? data.rawText : undefined,
    conversationHistory: data.conversationHistory as GridIQAPIResponse["conversationHistory"],
  };
}
