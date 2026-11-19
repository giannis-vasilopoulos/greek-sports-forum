# ΚΕΡΚΙΔΑ: Refactor plan

**Order**: tokens → primitives → domain components → shell → pages.
**Rules for every PR**

- ≤ 200 changed lines of non-test code (additions + deletions). CLI-generated shadcn files (`npx shadcn add …`) go in their **own** PR with no other changes and are excluded from the count.
- Each PR ships on its own: the app builds, nothing is half-wired, and nobody has to wait for the next PR.
- New components land **with one real call site** (or a Storybook/test page) so they're exercised.
- Shell changes ship behind `NEXT_PUBLIC_SHELL_V2` (cookie override `kerkida_shell=v2` for QA) until PR 28.
- Each PR: before/after screenshots in light + dark at 390 and 1280; `rg` from MIGRATION.md shows a falling count.

Line counts below are estimates based on the handoff files.

## Phase 1: Tokens (visual change, no markup changes)

| #   | PR                                                                    | Files                                                                                                                                                                                                                                                              | ~Lines | Ships alone because                                          | Verify                                                            |
| --- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | ------------------------------------------------------------ | ----------------------------------------------------------------- |
| 1   | **Fonts + lang**                                                      | `app/fonts.ts` (new), `app/layout.tsx` (`lang="el"`, font vars), `globals.css` (`--font-sans`, `--font-display`)                                                                                                                                                   | 45     | Same Inter, now with Greek subsets; Fira only declared       | Greek glyphs load from `greek`/`greek-ext`; uppercase drops tonos |
| 2   | **Core colour tokens**                                                | `globals.css` `:root` + `.dark` shadcn names only (background…sidebar-ring, cta, chart-1..5)                                                                                                                                                                       | 120    | Same token names → every component recolours (neon → cobalt) | Contrast spot-check; no green left on primary surfaces            |
| 3   | **Domain colour tokens**                                              | `globals.css`: live, halftime…ad-surface (light+dark) + `@theme inline` `--color-*` mappings                                                                                                                                                                       | 190    | Additive; unused until components land                       | `bg-live` etc. compile (grep built CSS)                           |
| 4   | **Type scale**                                                        | `globals.css`: `--text-*` (+ line-height/tracking/weight), weight tokens; **delete** old `.text-meta`; old `.text-hint/.text-secondary-size/.text-body-size/.text-title-size/.text-heading-size/.section-label` become deprecated aliases (`@apply` to new tokens) | 70     | Old class names keep working with new values                 | Visual diff: meta 11→13, body 13→15                               |
| 5   | **Radius, elevation, motion, z, density, icon/logo sizes, utilities** | `globals.css`: `@theme` motion + keyframes, `:root` z/durations/density/logo/icon vars, `.dark` elevation, utilities (`.text-overline`, `.text-system`, `.thread-title`, `.border-emphasis`, `.live-dot`), reduced-motion block, `scroll-padding-top`              | 150    | Additive                                                     | `prefers-reduced-motion` emulation in DevTools                    |
| 6   | **Domain types + format helpers**                                     | `lib/kerkida/types.ts`, `lib/kerkida/format.ts` + unit tests                                                                                                                                                                                                       | 200    | Pure TS                                                      | Tests for `formatRelativeEl`, `formatFeeEl`, `matchAriaLabel`     |
| 6b  | **Team colours in data** (backend)                                    | migration: `teams.color_1`, `teams.color_2` (+ seed for Super League)                                                                                                                                                                                              | n/a    | Nullable columns                                             | —                                                                 |

## Phase 2: Primitives

| #   | PR                                                                                                                                                                   | ~Lines     | Notes                                      |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------ |
| 7   | shadcn CLI: `switch toggle toggle-group collapsible drawer empty item alert` (generated only)                                                                        | (excluded) | No usage yet                               |
| 8   | **Button** replacement (`cta`, `xs`, `icon-*`, `loading`, touch sizes) + migrate the 3 hand-rolled CTA buttons (`bg-primary text-black…` Εγγραφή) to `variant="cta"` | 140        | Variant names compatible with stock shadcn |
| 9   | **Badge** replacement + migrate thread-type pills (“Match”, “Συζήτηση”, “Νέα”, “Φήμη μεταγραφής”)                                                                    | 120        |                                            |
| 10  | **Input** + **Tabs** replacements; migrate transfers Αφίξεις/Αποχωρήσεις toggle to `TabsList variant="pill"`                                                         | 150        |                                            |
| 11  | **LiveDot/LivePill, TeamLogo/LeagueLogo, TeamFlair** + replace `<img>` logos in footer + standings                                                                   | 160        | Fallbacks show until WebP assets exist     |
| 12  | **TeamAvatar** (ring + badge) + replace user avatars in comments & header                                                                                            | 120        | Needs 6b; ring hidden when colours null    |

## Phase 3: Domain components (each replaces one existing widget in place)

| #   | PR                                                                                                                        | ~Lines | Replaces                                         |
| --- | ------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------ |
| 13  | `MatchChip` + `ScoreAnnouncer`                                                                                            | 150    | current top match cards (markup only, same data) |
| 14  | `MatchBar` (scroll, arrows, empty/error, reserved height)                                                                 | 110    | the match bar container                          |
| 15  | `ThreadRow` + `ThreadList` + skeleton                                                                                     | 160    | feed rows on `/` (+ `?density=compact` QA flag)  |
| 16  | `VoteButtons` (optimistic)                                                                                                | 110    | thread vote chevrons                             |
| 17  | `PostCard` part 1: author line, body, actions, nesting, collapse                                                          | 190    | thread replies                                   |
| 18  | `PostCard` part 2: moderation states + `BestFirstBanner` + depth-6 “Συνέχεια”                                             | 90     |                                                  |
| 19  | `ReplyComposer` desktop (gates, draft, Ctrl+Enter, rate-limit)                                                            | 170    | inline textarea                                  |
| 20  | `ReplyComposer` mobile bar + Sheet                                                                                        | 70     |                                                  |
| 21  | `FormGuide` + `StandingsTable` + `StandingsLegend`                                                                        | 160    | `/standings` table                               |
| 22  | `TransfersTable` (table + mobile cards)                                                                                   | 120    | team transfers table                             |
| 23  | `RumorCard` (+ vote endpoint wiring)                                                                                      | 150    | rumour rows                                      |
| 24  | `AccountMenu` + `NotificationBell`                                                                                        | 150    | user pill + bell                                 |
| 25  | `NotificationItem` + Notifications list grouping                                                                          | 110    | `/notifications` rows                            |
| 26  | `layout-blocks` (SectionHeader, PageTitle, SidebarWidget, EmptyState, DataUnavailable) + replace “Προσωρινά μη διαθέσιμο” | 160    |                                                  |
| 27  | `AdSlot` + replace empty ad gaps (feed, standings, transfers)                                                             | 120    |                                                  |
| 27b | `CookieConsent` + footer “Ρυθμίσεις cookies” link; remove old bar & floating pill                                         | 150    |                                                  |
| 27c | Auth bits (`PasswordInput`, `GoogleButton`, `OnboardingStepper`, `ChoiceTiles`) into sign-up + onboarding                 | 170    |                                                  |

## Phase 4: Shell (behind `NEXT_PUBLIC_SHELL_V2`)

| #     | PR                                                                                                                                                  | ~Lines     | Notes                             |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------- |
| 28a   | `AppHeader` (Greek nav) + `BottomNav`, flag-gated in root layout                                                                                    | 160        | v1 header untouched when flag off |
| 28b   | `LeagueBar` (+ “Όλες” Popover/Sheet) + `PageTabs`; `hrefFor` keeps the section                                                                      | 180        |                                   |
| 28c   | `AppShell` + `EntityHeader`; route group `(app)` uses it when flag on; rail only ≥xl; widgets inline below xl                                       | 150        |                                   |
| 28d   | Thread = focused route on mobile (back header, composer replaces bottom nav, compact `ScoreBug`)                                                    | 120        |                                   |
| 28e   | **Flip flag on** in production; keep v1 code one release for rollback                                                                               | 10         |                                   |
| 28f–h | Delete v1: left sidebar (`w-[168px]`), right sidebar (`w-[200px]`), header Leagues dropdown, in-feed league tabs, mobile league sheet (one PR each) | ≤ 200 each | deletions count                   |

## Phase 5: Pages (each = one route; follow `pages/*.md`)

| #   | Page                                                                                               | ~Lines     |
| --- | -------------------------------------------------------------------------------------------------- | ---------- |
| 29  | Home `/` + `/match-threads` (`pages/home.md`)                                                      | 150        |
| 30  | Thread discussion (`pages/thread.md`)                                                              | 160        |
| 31  | Live match thread variant + hero `ScoreBug`                                                        | 120        |
| 32  | Standings + `/standings` redirect (`pages/standings.md`)                                           | 120        |
| 33  | Team transfers + league team-picker grid (`pages/transfers.md`)                                    | 180        |
| 34  | Transfer rumours team page + submit Sheet (`pages/transfer-rumors.md`)                             | 190        |
| 35  | **New** League hub `/leagues/[league]` (+ tabs routing) (`pages/league-hub.md`)                    | 190        |
| 36  | **New** Leagues index `/leagues`                                                                   | 90         |
| 37  | **New** Team page `/leagues/[league]/teams/[team]` (`pages/team.md`)                               | 180        |
| 38  | Fan profiles manager                                                                               | 150        |
| 39  | Notifications page + settings switches                                                             | 140        |
| 40  | **New** Member profile `/members/[username]`                                                       | 180        |
| 41  | Sign-up + onboarding (3 steps)                                                                     | 170        |
| 42  | **New** `/members`, `/about`, `/terms`, `/contact`, error page on the new shell                    | ≤ 200 each |
| 43  | Cleanup: remove deprecated alias utilities from PR 4; enable the lint rule (MIGRATION §6) as error | 60         |

## Definition of done (whole programme)

- `rg` from MIGRATION.md returns 0 matches.
- Lighthouse a11y ≥ 95 on home, thread, standings (mobile); CLS < 0.05 with ads.
- Manual: VoiceOver iOS + TalkBack read a goal announcement once; keyboard-only reply with Ctrl+Enter.
