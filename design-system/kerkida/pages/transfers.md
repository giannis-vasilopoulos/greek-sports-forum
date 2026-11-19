# Page override: Transfers

**Routes**: `/transfers` (league picker → redirect to active league) · `/leagues/{league}/transfers` (team picker grid, also hub tab) · `/leagues/{league}/teams/{team}/transfers` (team tab) · **Canvas board**: S08

## Team transfers layout

| Zone          | Mobile                                                                                                                                                                                                         | Desktop                                            |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Header / nav  | `active="transfers"`, `BottomNav`                                                                                                                                                                              | same                                               |
| League bar    | `showScopes={false}`                                                                                                                                                                                           | same                                               |
| Entity header | `EntityHeader` compact: `TeamLogo size="lg"`, **ΠΑΟΚ** (`text-system text-display-sm`), «Η ομάδα σου», meta (league · θέση · βαθμοί · `FormGuide`) + `PageTabs` (Συζητήσεις · Αγώνες · **Μεταγραφές** · Φήμες) | same, `size="2xl"` logo when not compact           |
| Summary       | 2×2 stat cards: Αφίξεις, Αποχωρήσεις, Δαπάνη, Δανεισμοί (`tabular-nums`)                                                                                                                                       | 4 in a row                                         |
| List          | `TransfersTable` → card list (<md)                                                                                                                                                                             | table (≥md) with season Select                     |
| Ad            | `table-bottom` after the list                                                                                                                                                                                  | `leaderboard`                                      |
| Rail          | —                                                                                                                                                                                                              | top open rumour (`RumorCard`) “Από τις Φήμες”, MPU |

## League transfers (team picker)

Team grid (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-7`), each tile `TeamLogo size="lg"` + name + position; favourite team first and highlighted (`bg-accent border-primary`). Replaces the current 2-column button list with mixed-case duplicates (ΑΕΚ / Α.Ε.Κ.): de-duplicate team records in data first.

## Rules

- All labels Greek: Μεταγραφή, Δανεισμός, Επιστροφή από δανεισμό, Ελεύθερος, “—” (title “Άγνωστο”). Use `formatFeeEl`.
- Direction = icon + word (Άφιξη/Αποχώρηση), never colour alone. Colours: `arrival` (cobalt), `departure` (magenta).
- Filter is in-page (Radix Tabs), synced to `?type=in|out` with `router.replace` (no history spam).
