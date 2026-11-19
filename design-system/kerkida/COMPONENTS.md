# ΚΕΡΚΙΔΑ: Component API

Every component lists: **file**, the **shadcn primitive** it extends, its **cva variants**, and **props**. Full code is in `components/`. All components:

- take `className` (merged with `cn`) unless noted;
- use tokens only (no hex, no `text-[13px]`); the only arbitrary sizes are decorative glyphs inside logos/pips/count badges (documented inline);
- render Greek copy; strings are inline for now. Move them to your i18n layer when you add one.

Install the shadcn primitives first (radix-nova style):

```bash
npx shadcn@latest add button badge input textarea select label field tabs dropdown-menu popover sheet drawer card separator tooltip skeleton sonner avatar switch table toggle toggle-group collapsible alert empty item
```

Then **replace** `components/ui/{button,badge,tabs,input}.tsx` with the versions in this handoff. All other shadcn files stay stock.

---

## Primitives (components/ui)

### Button: `components/ui/button.tsx` (replaces shadcn Button)

```ts
variant: "default" (primary) | "cta" | "secondary" | "outline" | "ghost" | "link" | "destructive"
size:    "xs" (24) | "sm" (32→44 touch) | "default" (40→44 touch) | "lg" (48) | "icon" (40→44) | "icon-sm" (32→44) | "icon-xs" (24)
props:   ButtonProps = ComponentProps<"button"> & { variant?, size?, asChild?: boolean, loading?: boolean }
```

- `loading`: spinner replaces the leading icon, width kept, `aria-busy`, disabled.
- `cta`: pill + `shadow-md`; once per view. Use `asChild` with `next/link` for navigation.
- States: hover `/90` (fills) or `accent` (outline/ghost) · active `/80` + 1px press · focus-visible ring 2 + offset 2 · disabled 50%.

### Badge: `components/ui/badge.tsx` (replaces shadcn Badge)

```ts
variant: "default" | "secondary" | "outline" | "accent" | "destructive"
       | "live" | "halftime" | "finished" | "scheduled" | "postponed"
       | "arrival" | "departure" | "rumor" | "rep-1" | "rep-2" | "rep-3" | "rep-4"
       | "success" | "warning" | "info"
size:    "default" (20) | "sm" (18)
props:   ComponentProps<"span"> & { variant?, size?, asChild? }
```

For LIVE use `<LivePill minute>` (adds the pulse dot). Badges are not interactive.

### Tabs: `components/ui/tabs.tsx` (replaces shadcn Tabs)

```ts
<TabsList variant="pill" | "underline">   // trigger style follows the list via context
<TabsCount>6</TabsCount>                   // count chip inside a trigger
```

Use for **in-page** filters (Όλες/Αφίξεις/Αποχωρήσεις, Κορυφαία/Νεότερα). Route-level tabs → `<PageTabs>`.

### Input: `components/ui/input.tsx` (replaces shadcn Input)

40px desktop / 44px touch, 16px text on mobile (no iOS zoom), 15px ≥md. Error via `aria-invalid`. Export `inputClassName` for InputGroup.

### Unchanged shadcn primitives (use as-is, with tokens)

| Primitive                                               | Usage rules                                                                                                                  |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Textarea                                                | `field-sizing-content min-h-22 max-h-80` for autosize (composer).                                                            |
| Select                                                  | Items may contain `<TeamLogo size="sm">`. >12 options → Combobox (Command + Popover).                                        |
| Field (Field, FieldLabel, FieldDescription, FieldError) | Label 14/600; description `text-meta text-muted-foreground`; error 13/500 destructive + icon; errors on blur/submit.         |
| DropdownMenu                                            | Item 36px; destructive item last (`variant="destructive"`). On <md prefer Drawer for long menus.                             |
| Popover / HoverCard                                     | `rounded-xl p-4 shadow-md`. Hover card desktop-only.                                                                         |
| Sheet / Drawer                                          | Mobile nav (left, 320), bottom sheets (league list, composer, cookie settings).                                              |
| Card                                                    | Interactive card = `<Link>` with `hover:shadow-sm focus-visible:ring-2`. Selected = `bg-accent border-primary` + text badge. |
| Separator                                               | `bg-border`; labelled variant for «ή με email».                                                                              |
| Tooltip                                                 | Inverted (`bg-foreground text-background`), delay 500. Never the only carrier of info.                                       |
| Skeleton                                                | Same box sizes as the real component. Show after 300ms.                                                                      |
| Sonner (toast)                                          | Desktop bottom-right, mobile bottom-centre above composer, `z-(--z-toast)`. Errors persist.                                  |
| Switch                                                  | Cookie settings, notification settings. Label left, full row 44px.                                                           |
| Avatar                                                  | Wrapped by `<TeamAvatar>`.                                                                                                   |
| Table                                                   | Wrapped by `<StandingsTable>`, `<TransfersTable>`.                                                                           |

---

## Domain components (components/kerkida)

| Component                                                                      | File                  | Extends                                        | cva                                                                                                                        | Key props                                                                                                                                                                                       |
| ------------------------------------------------------------------------------ | --------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LiveDot`, `LivePill`                                                          | live-dot.tsx          | —                                              | —                                                                                                                          | `minute?`, `label?`                                                                                                                                                                             |
| `TeamLogo`, `LeagueLogo`                                                       | team-logo.tsx         | next/image                                     | `logoVariants.size: xs·sm·md·lg·xl·2xl`                                                                                    | `team` / `league`, `size`                                                                                                                                                                       |
| `TeamAvatar`                                                                   | team-avatar.tsx       | Avatar                                         | `teamAvatarVariants.size: sm·md·lg·xl`                                                                                     | `name`, `src?`, `team?` (ring), `showTeamBadge?`                                                                                                                                                |
| `TeamFlair`                                                                    | team-flair.tsx        | —                                              | —                                                                                                                          | `team`, `href?`                                                                                                                                                                                 |
| `MatchChip`, `MatchChipSkeleton`                                               | match-chip.tsx        | Card (as Link) + Badge                         | `matchChipVariants.status: scheduled·live·halftime·finished·postponed·cancelled`, `.size: default(176)·compact(160)·fluid` | `match`, `size?`                                                                                                                                                                                |
| `MatchBar`                                                                     | match-bar.tsx         | ScrollArea pattern + Button                    | —                                                                                                                          | `matches: Match[] \| null` (null = loading), `error?`, `lastUpdated?`, `onRetry?`, `nextMatchLabel?`                                                                                            |
| `ScoreAnnouncer`                                                               | score-announcer.tsx   | —                                              | —                                                                                                                          | `matches`, `enabled?` (one per page)                                                                                                                                                            |
| `ScoreBug`                                                                     | score-bug.tsx         | —                                              | `scoreBugVariants.variant: hero·compact`                                                                                   | `match`, `variant`, `teamHref(team)`                                                                                                                                                            |
| `LeagueBar`                                                                    | league-bar.tsx        | Link pills + Popover (≥md) / Sheet (<md)       | —                                                                                                                          | `leagues`, `myLeagues`, `active: LeagueSlug \| "all" \| "live"`, `showScopes?`, `liveCount?`, `hrefFor(scope)`, `ticker?`, `onTickerClick?`, `maxPills?`                                        |
| `PageTabs`                                                                     | page-tabs.tsx         | — (links, aria-current)                        | —                                                                                                                          | `tabs: {href,label,count?}[]`, `activeHref`                                                                                                                                                     |
| `ThreadRow`, `ThreadList`, `ThreadRowSkeleton`                                 | thread-row.tsx        | Item (as Link)                                 | `threadRowVariants.density: comfortable·compact`, `.pinned`; `threadTileVariants.type × density`                           | `thread: ThreadSummary`, `density?`                                                                                                                                                             |
| `VoteButtons`                                                                  | vote-buttons.tsx      | Toggle                                         | —                                                                                                                          | `score`, `myVote`, `disabled?`, `disabledReason?`, `orientation?: vertical·horizontal`, `onVote(next)` (optimistic, rolls back on throw)                                                        |
| `PostCard`, `AuthorLine`, `BestFirstBanner`                                    | post-card.tsx         | Card, Collapsible, Badge, Button, DropdownMenu | —                                                                                                                          | `post`, `depth?`, `isRoot?`, `isOp?`, `canVote`, `voteDisabledReason?`, `defaultCollapsed?`, `profileHref(author)`, `continueHref?(post)`, `onVote?`, `onReply?`, `onReport?` · `MAX_DEPTH = 6` |
| `ReplyComposer`                                                                | reply-composer.tsx    | Textarea, Button, Sheet                        | —                                                                                                                          | `threadId`, `gate: ok·guest·needs_profile·rate_limited·locked`, `replyTo?`, `onCancelReply?`, `onSubmit(text)`, `maxLength?` (10000)                                                            |
| `FormGuide`                                                                    | form-guide.tsx        | —                                              | `formPipVariants.result: W·D·L`, `.size`                                                                                   | `results: FormResult[]`, `size?`                                                                                                                                                                |
| `StandingsTable`, `StandingsLegend`                                            | standings-table.tsx   | Table                                          | —                                                                                                                          | `caption`, `rows`, `favoriteTeamId?`, `separatorsAfter?` ([4,8,12]), `density?`, `variant?: full·mini`                                                                                          |
| `TransfersTable`                                                               | transfers-table.tsx   | Tabs (pill) + Table / list                     | —                                                                                                                          | `transfers`, `defaultFilter?: all·in·out`, `seasonSelect?`                                                                                                                                      |
| `RumorCard`                                                                    | rumor-card.tsx        | Card + Badge + toggle buttons                  | —                                                                                                                          | `rumor`, `canVote`, `signInHref?`, `onVote?(id, v)`                                                                                                                                             |
| `AccountMenu`                                                                  | account.tsx           | DropdownMenu (+RadioGroup)                     | —                                                                                                                          | `username`, `avatarUrl?`, `profiles`, `activeProfileId`, `leaguesWithoutProfile`, `onSwitchProfile`, `hrefs`, `onSignOut`, `theme`, `density`                                                   |
| `NotificationBell`                                                             | account.tsx           | Button (icon, asChild Link)                    | —                                                                                                                          | `unread`, `href`                                                                                                                                                                                |
| `NotificationItem`                                                             | notification-item.tsx | Item (as Link)                                 | `notificationItemVariants.read`                                                                                            | `n: AppNotification`                                                                                                                                                                            |
| `SectionHeader`, `PageTitle`, `SidebarWidget`, `EmptyState`, `DataUnavailable` | layout-blocks.tsx     | Card / Empty / Alert                           | `emptyStateVariants.variant: block·inline`                                                                                 | see file                                                                                                                                                                                        |
| `AdSlot`                                                                       | ad-slot.tsx           | —                                              | `adSlotVariants.size: leaderboard·mpu·mobile-banner·mobile-feed`                                                           | `slotId`, `placement`, `load?(el, id)`, `houseAd?`, `sticky?`                                                                                                                                   |
| `CookieConsent`                                                                | cookie-consent.tsx    | Sheet + Switch + Button                        | —                                                                                                                          | `open`, `initial?`, `onSave(prefs)`, `policyHref`                                                                                                                                               |
| `PasswordInput`, `GoogleButton`, `OnboardingStepper`, `ChoiceTiles`            | auth.tsx              | Input, Button, ToggleGroup                     | —                                                                                                                          | see file (`GoogleButton.mark` = official asset)                                                                                                                                                 |
| `AppHeader`, `GuestActions`, `PRIMARY_NAV`                                     | app-header.tsx        | Button                                         | —                                                                                                                          | `active?`, `liveCount?`, `right`, `back?`                                                                                                                                                       |
| `BottomNav`                                                                    | bottom-nav.tsx        | —                                              | —                                                                                                                          | `liveCount?`, `avatar?`, `guest?`                                                                                                                                                               |
| `AppShell`, `EntityHeader`                                                     | app-shell.tsx         | —                                              | —                                                                                                                          | `header`, `leagueBar?`, `top?`, `rail?`, `footer?`, `bottom?` · `media`, `title`, `meta?`, `aside?`, `tabs`                                                                                     |

### Shared types & helpers

- `lib/kerkida/types.ts`: `League`, `Team`, `Match`, `FanProfile`, `ThreadSummary`, `Post`, `StandingRow`, `Transfer`, `Rumor`, `AppNotification`…
- `lib/kerkida/format.ts`: `formatRelativeEl`, `formatKickoffEl`, `formatFeeEl`, `matchAriaLabel`, `numberEl`.

### Composition example (home)

```tsx
<AppShell
  header={
    <AppHeader
      active="home"
      liveCount={3}
      right={
        <>
          <NotificationBell unread={3} href="/notifications" />
          <AccountMenu {...account} />
        </>
      }
    />
  }
  leagueBar={
    <LeagueBar
      leagues={leagues}
      myLeagues={["super-league", "euroleague"]}
      active="all"
      liveCount={3}
      hrefFor={(s) =>
        s === "all" ? "/" : s === "live" ? "/?live=1" : `/leagues/${s}`
      }
    />
  }
  top={<MatchBar matches={matches} />}
  rail={
    <>
      <SidebarWidget
        title="Βαθμολογία · Super League"
        footer={{
          href: "/leagues/super-league/standings",
          label: "Πλήρης βαθμολογία",
        }}
      >
        <StandingsTable
          variant="mini"
          caption="Βαθμολογία Super League"
          rows={rows}
          favoriteTeamId={fav}
        />
      </SidebarWidget>
      <AdSlot size="mpu" placement="rail" slotId="home-rail" sticky />
    </>
  }
  bottom={<BottomNav liveCount={3} />}
>
  <AdSlot
    size="leaderboard"
    placement="top"
    slotId="home-top"
    className="max-md:hidden"
  />
  <ThreadList>
    {threads.slice(0, 6).map((t) => (
      <ThreadRow key={t.id} thread={t} />
    ))}
    <AdSlot size="leaderboard" placement="in-feed" slotId="home-feed-1" />
    {threads.slice(6).map((t) => (
      <ThreadRow key={t.id} thread={t} />
    ))}
  </ThreadList>
</AppShell>
```
