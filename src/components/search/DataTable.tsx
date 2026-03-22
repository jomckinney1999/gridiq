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
    <div className="overflow-hidden rounded-xl border-[0.5px] border-[rgba(255,255,255,0.06)] bg-[#0d0d10]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="bg-[rgba(255,255,255,0.02)]">
              {headers.map((h) => (
                <th
                  key={h}
                  className="border-b border-[rgba(255,255,255,0.06)] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#44445a]"
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
                  className={`border-t-[0.5px] border-[rgba(255,255,255,0.04)] transition-colors hover:bg-[rgba(255,255,255,0.02)] ${
                    highlight
                      ? "bg-[rgba(0,255,135,0.06)] text-[#00ff87] hover:bg-[rgba(0,255,135,0.08)]"
                      : ""
                  }`}
                >
                  {cells.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-4 py-3 ${
                        ci === 0
                          ? `font-medium ${highlight ? "text-[#00ff87]" : "text-[#f2f2f5]"}`
                          : highlight
                            ? "text-[#00ff87]"
                            : "text-[#8888a0]"
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
