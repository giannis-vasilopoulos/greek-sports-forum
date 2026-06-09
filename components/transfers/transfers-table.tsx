import Link from "next/link";

import { EntityLogo } from "@/components/brand/entity-logo";
import type { TransfersTableRow } from "@/lib/transfers/queries";
import { copy } from "@/lib/copy";
import { formatTransferFee } from "@/lib/copy/transfers";
import { teamTransfersPath } from "@/lib/seo/paths";
import { cn } from "@/lib/utils";

const t = copy.transfers.table;

interface TransfersTableProps {
  rows: TransfersTableRow[];
  leagueSlug?: string;
  className?: string;
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

function TeamCell({
  name,
  logoUrl,
  teamUrlSlug,
  leagueSlug,
}: {
  name: string;
  logoUrl?: string | null;
  teamUrlSlug?: string | null;
  leagueSlug?: string;
}) {
  const content = (
    <span className="inline-flex items-center gap-1.5">
      <EntityLogo src={logoUrl} alt="" fallback="⚽" size="xs" />
      {name}
    </span>
  );

  if (leagueSlug && teamUrlSlug) {
    return (
      <Link
        href={teamTransfersPath(leagueSlug, teamUrlSlug)}
        className="hover:text-primary hover:underline"
      >
        {content}
      </Link>
    );
  }

  return content;
}

export function TransfersTable({
  rows,
  leagueSlug,
  className,
}: TransfersTableProps) {
  if (rows.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        {copy.transfers.emptySync}
      </p>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm" aria-label={t.ariaLabel}>
        <thead>
          <tr className="border-border text-muted-foreground border-b text-left">
            <th className="pr-3 pb-2 font-medium">{t.player}</th>
            <th className="pr-3 pb-2 font-medium">{t.from}</th>
            <th className="pr-3 pb-2 font-medium">{t.to}</th>
            <th className="pr-3 pb-2 font-medium">{t.date}</th>
            <th className="pb-2 font-medium">{t.fee}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const rowLeagueSlug = row.leagueSlug ?? leagueSlug;
            return (
              <tr
                key={`${row.playerName}-${row.toTeamName}-${row.transferDate}`}
                className="border-border/60 border-b last:border-b-0"
              >
                <td className="py-2.5 pr-3 font-medium">{row.playerName}</td>
                <td className="py-2.5 pr-3">
                  <TeamCell
                    name={row.fromTeamName}
                    logoUrl={row.fromTeamLogoUrl}
                    teamUrlSlug={row.fromTeamUrlSlug}
                    leagueSlug={rowLeagueSlug}
                  />
                </td>
                <td className="py-2.5 pr-3">
                  <TeamCell
                    name={row.toTeamName}
                    logoUrl={row.toTeamLogoUrl}
                    teamUrlSlug={row.toTeamUrlSlug}
                    leagueSlug={rowLeagueSlug}
                  />
                </td>
                <td className="text-muted-foreground py-2.5 pr-3 tabular-nums">
                  {formatDate(row.transferDate)}
                </td>
                <td className="text-muted-foreground py-2.5 tabular-nums">
                  {formatTransferFee(row.feeText)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
