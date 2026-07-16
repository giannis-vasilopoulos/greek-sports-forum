import Link from "next/link";

import { EntityLogo } from "@/components/brand/entity-logo";
import {
  FOOTER_INFO_LINKS,
  getLeagueHref,
} from "@/components/layout/site-data";
import { copy } from "@/lib/copy";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface FooterProps {
  leagues?: Array<{
    slug: string;
    name: string;
    emoji: string;
    logoUrl?: string | null;
  }>;
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const l = copy.layout;

export function Footer({ leagues = [] }: FooterProps) {
  return (
    <footer className="border-border bg-background border-t">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-3 md:gap-12">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-foreground text-[15px] font-medium tracking-[0.08em]"
            >
              {l.brand}
            </Link>
            <p className="text-muted-foreground text-sm">{l.tagline}</p>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                >
                  <XIcon className="size-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="size-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="size-4" />
                </a>
              </Button>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-medium">
              {l.footer.leaguesHeading}
            </h2>
            <ul className="flex flex-col gap-2">
              {leagues.map((league) => (
                <li key={league.slug}>
                  <Link
                    href={getLeagueHref(league.slug)}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    <span className="mr-1.5 inline-flex align-middle">
                      <EntityLogo
                        src={league.logoUrl}
                        alt={`Λογότυπο ${league.name}`}
                        fallback={league.emoji}
                        size="xs"
                      />
                    </span>
                    {league.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-medium">{l.footer.infoHeading}</h2>
            <ul className="flex flex-col gap-2">
              {FOOTER_INFO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-muted-foreground flex flex-col-reverse items-start justify-between gap-2 text-xs md:flex-row md:items-center">
          <p>{l.footer.copyright}</p>
          <p>{l.footer.madeFor}</p>
        </div>
      </div>
    </footer>
  );
}
