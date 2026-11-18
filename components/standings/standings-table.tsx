import { Fragment } from "react";

import { EntityLogo } from "@/components/brand/entity-logo";
import type { StandingsTableRow } from "@/lib/standings/queries";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

const t = copy.standings.table;

interface StandingsTableProps {
  rows: StandingsTableRow[];
  className?: string;
  /** Ranks after which to render a thicker phase separator (e.g. Super League 4 and 8). */
  phaseBreaksAfterRanks?: number[];
}

function hasExtendedStats(rows: StandingsTableRow[]): boolean {
  return rows.some(
    (r) =>
      r.played !== undefined ||
      r.won !== undefined ||
      r.drawn !== undefined ||
      r.lost !== undefined,
  );
}

function phaseSeparatorLabel(rank: number): string {
  if (rank === 4) return copy.standings.phaseSeparatorPlayoffs;
  if (rank === 8) return copy.standings.phaseSeparatorPlayouts;
  return "";
}

export function StandingsTable({
  rows,
  className,
  phaseBreaksAfterRanks,
}: StandingsTableProps) {
  const phaseBreaks = new Set(phaseBreaksAfterRanks ?? []);
  const extended = hasExtendedStats(rows);

  if (rows.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        {copy.standings.emptySync}
      </p>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[320px] text-sm" aria-label={t.ariaLabel}>
        <thead>
          <tr className="border-border text-muted-foreground border-b text-left text-[11px]">
            <th className="w-10 pr-2 pb-2 font-medium">{t.rank}</th>
            <th className="pr-2 pb-2 font-medium">{t.team}</th>
            {extended ? (
              <>
                <th className="w-8 px-1 pb-2 text-center font-medium">
                  {t.played}
                </th>
                <th className="w-8 px-1 pb-2 text-center font-medium">
                  {t.won}
                </th>
                <th className="w-8 px-1 pb-2 text-center font-medium">
                  {t.drawn}
                </th>
                <th className="w-8 px-1 pb-2 text-center font-medium">
                  {t.lost}
                </th>
              </>
            ) : null}
            <th className="w-12 pb-2 pl-2 text-right font-medium">
              {t.points}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <Fragment key={row.rank}>
              <tr className="border-border/60 border-b last:border-0">
                <td className="text-muted-foreground py-2 pr-2 tabular-nums">
                  {row.rank}
                </td>
                <td className="py-2 pr-2 font-medium">
                  <span className="inline-flex items-center gap-2">
                    <EntityLogo
                      src={row.teamLogoUrl}
                      alt={`Λογότυπο ${row.team}`}
                      fallback={row.team.slice(0, 1)}
                      size="sm"
                    />
                    {row.team}
                  </span>
                </td>
                {extended ? (
                  <>
                    <td className="px-1 py-2 text-center tabular-nums">
                      {row.played ?? "—"}
                    </td>
                    <td className="px-1 py-2 text-center tabular-nums">
                      {row.won ?? "—"}
                    </td>
                    <td className="px-1 py-2 text-center tabular-nums">
                      {row.drawn ?? "—"}
                    </td>
                    <td className="px-1 py-2 text-center tabular-nums">
                      {row.lost ?? "—"}
                    </td>
                  </>
                ) : null}
                <td className="py-2 pl-2 text-right font-medium tabular-nums">
                  {row.points}
                </td>
              </tr>
              {phaseBreaks.has(row.rank) ? (
                <tr
                  key={`phase-${row.rank}`}
                  className="border-border border-b-2"
                  aria-hidden={phaseSeparatorLabel(row.rank) === ""}
                >
                  <td colSpan={extended ? 8 : 3}>
                    <span className="sr-only">
                      {phaseSeparatorLabel(row.rank)}
                    </span>
                  </td>
                </tr>
              ) : null}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
