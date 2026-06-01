import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FeedShellProps {
  left: ReactNode;
  main: ReactNode;
  right: ReactNode;
  className?: string;
}

export function FeedShell({ left, main, right, className }: FeedShellProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl", className)}>
      <div className="flex flex-col lg:flex-row">
        <aside className="hidden w-[168px] shrink-0 border-r border-border lg:block">
          <div className="sticky top-[52px] px-3 py-4">{left}</div>
        </aside>

        <div className="min-w-0 flex-1 px-4 py-4">{main}</div>

        <aside className="hidden w-[200px] shrink-0 border-l border-border lg:block">
          <div className="sticky top-[52px] px-3 py-4">{right}</div>
        </aside>
      </div>

      <aside className="border-t border-border px-4 py-4 lg:hidden">
        {right}
      </aside>
    </div>
  );
}
