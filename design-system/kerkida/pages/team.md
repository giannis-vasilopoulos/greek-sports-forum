# Page override: Team page (NEW)

**Routes**: `/leagues/{league}/teams/{team}` (Συζητήσεις) · `/matches` · `/transfers` · `/transfer-rumors` · **Canvas board**: S06

## Layout

| Zone            | Mobile                                                                                                                                                                                                                      | Desktop                                                  |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| League bar      | `showScopes={false} active={league}`                                                                                                                                                                                        | same                                                     |
| Entity header   | `TeamLogo size="xl"` + **ΠΑΟΚ** (`PageTitle`, Fira: team names are system data) + «Η ομάδα σου» badge (if favourite) + meta: league · **3η** · 54 βαθμοί · `FormGuide`; `PageTabs` Συζητήσεις · Αγώνες · Μεταγραφές · Φήμες | + aside: “Τώρα” / “Επόμενος” `MatchChip`                 |
| Live/next match | full-width `MatchChip size="fluid"` under the header                                                                                                                                                                        | in the aside                                             |
| Συζητήσεις      | pill tabs + “Νέο θέμα για ΠΑΟΚ” + `ThreadList` (threads tagged with the team)                                                                                                                                               | same                                                     |
| Rail            | “Τελευταίες μεταγραφές” widget below the list                                                                                                                                                                               | mini standings (team highlighted), latest transfers, MPU |

## Rules

- Entry points: standings row, team flair, scorebug team name, hub Ομάδες grid, transfers picker.
- Team colours appear **only** in avatar rings of members; the page chrome stays neutral (no team-coloured header).
- Abbreviation (FUTURE): always `team.shortName ?? team.name`.
- `<h1>` = team name; breadcrumb Super League › Ομάδες › ΠΑΟΚ on desktop.
