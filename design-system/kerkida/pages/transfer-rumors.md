# Page override: Transfer rumours

**Routes**: `/transfer-rumors` → tab inside Μεταγραφές · `/leagues/{league}/transfer-rumors` · `/leagues/{league}/teams/{team}/transfer-rumors` (team tab **Φήμες**) · **Canvas board**: S09

## Layout

| Zone          | Mobile                                                                                                                                                   | Desktop                                                                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entity header | as transfers.md, active tab **Φήμες**                                                                                                                    | same                                                                                                                                                 |
| Submit        | signed in: `Button size="lg" full` “Υπέβαλε φήμη” → bottom Sheet with the form · guest: accent strip “Συνδέσου για να υποβάλεις ή να ψηφίσεις” + Σύνδεση | inline Card form (2 columns): Παίκτης, Από ομάδα (Select with logos), Πηγή (link, help text), Σχόλιο (optional) + Υποβολή; daily limit shown in meta |
| Filter        | pill tabs Ανοιχτές · Επιβεβ. · Διαψ.                                                                                                                     | Ανοιχτές N · Επιβεβαιώθηκαν N · Διαψεύστηκαν N + sort “Πιο πιστευτές”                                                                                |
| Feed          | `RumorCard` stacked                                                                                                                                      | 2-column grid                                                                                                                                        |
| Rail          | —                                                                                                                                                        | latest official transfers, MPU                                                                                                                       |

## Rules

- Open rumour = dashed 1.5px `rumor-foreground` border on the whole card + «Ανεπιβεβαίωτο».
- Confirmed → `success` badge and a link to the transfer row; debunked → struck title + `finished` badge. Votes close on status change.
- Without a source link the rumour stays “σε έλεγχο” (visible only to author/mods).
- Rate limit: 5 rumours/day/profile, shown before submit.
- Credibility = two toggle buttons with %, the bar is `aria-hidden`.
