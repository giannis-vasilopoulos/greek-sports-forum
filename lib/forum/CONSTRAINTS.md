# Forum constraints reference

Canonical thresholds for permissions, moderation, and reputation.  
**Unit:** 1 downvote = post score −1 and author reputation −1 (`post_downvoted`).

## Write access (W1–W10)

| ID  | Constraint                        | Effect                                           |
| --- | --------------------------------- | ------------------------------------------------ |
| W1  | Guest                             | Read only                                        |
| W2  | No fan profile for league         | No write in that league                          |
| W3  | rep &lt; 30 in rival team section | Read only in other teams                         |
| W4  | Thread locked                     | No reply (mods bypass)                           |
| W5  | Active `league_ban`               | No write in league (30 days)                     |
| W6  | Active `account_ban`              | No write anywhere                                |
| W7  | Active `slow_mode`                | Max 1 post / 15 min in league (3 days)           |
| W8  | Active `shadow_ban`               | Posts hidden from others (7 days)                |
| W9  | Warning                           | −15 rep, no write block                          |
| W10 | Live `match_thread`               | rep &lt; 50 → 1 post/min; rep ≥ 50 → 3 posts/min |

No reputation floor on own-team / league-feed write (sanctions-only policy).

## Post-level (P1–P7)

| Trigger          | Effect           | Author rep |
| ---------------- | ---------------- | ---------- |
| Downvote         | score −1         | −1         |
| Upvote           | score +1         | +2         |
| score ≤ −5       | Collapsed        | cumulative |
| ≥ 3 reports      | Flagged for mods | —          |
| Post removed     | Hidden           | −10        |
| Report confirmed | Removed/marked   | −20        |

## Reputation events

See `lib/forum/constants.ts` → `reputationEventDeltas`.

## Sanction `leagueId` rules

| Type                                    | `leagueId`   |
| --------------------------------------- | ------------ |
| `league_ban`, `shadow_ban`, `slow_mode` | Required     |
| `account_ban`                           | Must be null |
| `warning`                               | Optional     |

## Voting

`canVote`: voter fan profile must be in the same league as the post's thread; no self-votes.
