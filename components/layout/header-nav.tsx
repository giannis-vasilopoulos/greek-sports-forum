"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  LEAGUES,
  NAV_LINKS,
  getLeagueHref,
} from "@/components/layout/site-data";
import { cn } from "@/lib/utils";

interface HeaderNavProps {
  hasLiveMatches?: boolean;
}

export function HeaderNav({ hasLiveMatches = false }: HeaderNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const isLeaguesActive = pathname.startsWith("/leagues");

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(isLeaguesActive && "text-foreground")}
          >
            Leagues
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-56 gap-1 p-1">
              {LEAGUES.map((league) => (
                <li key={league.slug}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={getLeagueHref(league.slug)}
                      className="flex items-center gap-2"
                    >
                      <span aria-hidden="true">{league.emoji}</span>
                      {league.name}
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {NAV_LINKS.map((link) => (
          <NavigationMenuItem key={link.href}>
            <NavigationMenuLink asChild>
              <Link
                href={link.href}
                className={cn(
                  navigationMenuTriggerStyle(),
                  "inline-flex items-center gap-2",
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {link.label}
                {link.liveIndicator && hasLiveMatches && (
                  <span
                    className="size-2 shrink-0 rounded-full bg-destructive animate-pulse"
                    aria-label="Ζωντανά ματς"
                  />
                )}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
