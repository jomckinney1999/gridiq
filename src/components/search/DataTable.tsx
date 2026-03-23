"use client";

import type { TableData, TableRow } from "@/types/gridiq-query";

function normalizeRow(row: TableRow): { cells: string[]; highlight?: boolean } {
  if (Array.isArray(row)) {
    return { cells: row };
  }
  return { cells: row.cells, highlight: row.highlight };
}

export function DataTable({ table }: { table: TableData }) {
  const { headers, rows } = table;
  if (!headers.length) return null;

  return (
    <div className="overflow-hidden rounded-xl border-[0.5px] border-[var(--border)] bg-[var(--bg-card)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="bg-[color-mix(in_srgb,var(--txt)_4%,transparent)]">
              {headers.map((h) => (
                <th
                  key={h}
                  className="border-b border-[var(--border)] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--txt-3)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((raw, ri) => {
              const { cells, highlight } = normalizeRow(raw);
              return (
                <tr
                  key={ri}
                  className={`border-t-[0.5px] border-[var(--border)] transition-colors hover:bg-[color-mix(in_srgb,var(--txt)_4%,transparent)] ${
                    highlight
                      ? "bg-[var(--green-light)] text-[var(--green)] hover:bg-[var(--green-light)]"
                      : ""
                  }`}
                >
                  {cells.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-4 py-3 ${
                        ci === 0
                          ? `font-medium ${highlight ? "text-[var(--green)]" : "text-[var(--txt)]"}`
                          : highlight
                            ? "text-[var(--green)]"
                            : "text-[var(--txt-2)]"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
