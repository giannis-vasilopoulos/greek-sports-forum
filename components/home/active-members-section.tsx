import type { ActiveMember } from "@/components/home/home-data";
import { getInitials } from "@/components/layout/site-data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActiveMembersSectionProps {
  members: ActiveMember[];
}

export function ActiveMembersSection({ members }: ActiveMembersSectionProps) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Ενεργά μέλη
        </h2>
        <p className="text-base text-muted-foreground">
          Φιλάθλοι που μιλάνε τώρα στις κερκίδες των leagues.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {members.map((member) => (
          <li key={member.id}>
            <Card
              size="sm"
              className="h-full py-4 transition-colors duration-200 hover:bg-muted/40"
            >
              <CardContent className="flex items-center gap-3 px-4 py-0">
                <div className="relative shrink-0">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-primary/10 text-xs text-primary">
                      {getInitials(member.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  {member.isOnline && (
                    <span
                      className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-card bg-chart-2"
                      aria-label="Συνδεδεμένος"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {member.displayName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    <span aria-hidden="true">{member.teamEmoji} </span>
                    {member.teamName} · {member.leagueName}
                  </p>
                </div>
                <p
                  className={cn(
                    "shrink-0 text-xs font-medium",
                    member.isOnline ? "text-chart-2" : "text-muted-foreground",
                  )}
                >
                  {member.activityLabel}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
