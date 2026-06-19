# Application Tasks & Issue Tracker

## 🤖 General Rules & Guidelines for Claude Code
- **Implement Tests:** You must implement tests to verify your fixes and new features. You have the autonomy to choose and configure the appropriate testing libraries (e.g., Jest, React Testing Library, Cypress, Supertest) for both the `frontend` and the `server`. Test everything you touch.
- **Commit Protocol:** Make granular, well-described commits immediately after a fix/feature is fully tested and verified.

---

## ✅ Completed Tasks

- [x] **Super Mundial de Clubes Pool Bug:** National teams excluded from `startLeaguePhase` in `GameContext.tsx` — fixed with mode-aware pool selection.
- [x] **Position Refactor:** Removed `SA`, `LIB`, `ALA` positions; reassigned to `CA/MEI`, `ZAG`, `MD/ME`.
- [x] **Remove Reload Warning:** `beforeunload` listener removed.
- [x] **World Cup UI Consistency:** Copa-group routing + knockout title fix for Copa do Mundo mode.
- [x] **World Cup Bracket Authenticity:** Cross-matching rules implemented for Round of 16.
- [x] **Brasileirão Final Screen:** "Ver Resultados" button added.
- [x] **Unranked Points Leak:** Rating submission and display gated behind `isRanked`.
- [x] **Doubled Statistics Bug:** Duplicate `startKnockoutPhase` calls eliminated.
- [x] **Logo URLs:** Fluminense, Botafogo, Athletico PR logos updated in `data.ts`.
- [x] **Super Mundial League Pool:** `startLeaguePhase` fixed to exclude national teams for Super Mundial.

---

## 📋 Open Issues (Audit Findings — 2026-06-19)

---

### 🔴 BUGS

#### ✅ B1 — `tournament/page.tsx:101` — Title hardcoded for one mode
**File:** `frontend/src/app/tournament/page.tsx`
**Line:** 101
**Problem:** `const title = lang === "pt" ? "SUPER MUNDIAL DE CLUBES" : "SUPER CLUB WORLD CUP"` — this page is also used for **Louco** mode but always shows Super Mundial title.
**Fix:** Add `tournamentMode` from `useGame()` and compute the title like `knockout/page.tsx` does (handle `"louco"` → `"MODO LOUCOS"` / `"CRAZY MODE"`).

---

#### ✅ B2 — `draft/page.tsx:41` — National teams in Super Mundial rolling animation
**File:** `frontend/src/app/draft/page.tsx`
**Line:** 38-42
**Problem:** The `allTeams` useMemo fallthrough case (`return getAllTeams(americans, europeans, nationalTeams)`) runs for both `super-mundial` AND `louco`. In super-mundial, national teams should be excluded from the slot-machine animation (they briefly flash national team names even though they can never be drafted in that mode). In louco, all teams should be included — which is correct.
**Fix:**
```typescript
const allTeams = useMemo(() => {
  if (tournamentMode === 'copa-do-mundo') return getAllTeams({} as any, {} as any, nationalTeams);
  if (tournamentMode === 'brasileirao') return getBrazilianTeams(americans);
  if (tournamentMode === 'super-mundial') return getAllTeams(americans, europeans); // clubs only
  return getAllTeams(americans, europeans, nationalTeams); // louco: everything
}, [tournamentMode]);
```

---

#### ✅ B3 — `simulation.ts:98` — Stale position codes in `calculateSectorStrengths`
**File:** `frontend/src/utils/simulation.ts`
**Line:** 98
**Problem:** `if (["PE", "PD", "CA", "SA", "ATA"].includes(pos))` — `"SA"` and `"ATA"` were removed in the position refactor but are still listed here. Dead code; no functional impact currently since no players have those codes, but should be cleaned up.
**Fix:** Remove `"SA"` and `"ATA"` from the array.

---

#### ✅ B4 — Brasileirão champion → result page shows "CAMPANHA ENCERRADA"
**Files:** `frontend/src/context/GameContext.tsx`, `frontend/src/app/result/page.tsx`
**Problem:** `isChampion` is only set to `true` inside `startKnockoutPhase`. For Brasileirão, there is no knockout phase — the result is determined by final standings position. So when a Brasileirão champion navigates to `/result`, `isChampion` is `false` and the page renders the red "CAMPANHA ENCERRADA" banner instead of a champion banner.
**Fix Options:**
- Option A: In `GameContext.tsx`, when `tournamentMode === 'brasileirao'`, derive `isChampion` from the final standings (`brasilRounds[last].standingsAfterRound[0].isUser`).
- Option B: In `result/page.tsx`, compute an effective `isChampion` that checks Brasileirão standings for that mode.
Option A is cleaner — add a `setBrasileiraoChampion` call inside `startBrasileirao` or when the user navigates from `/brasileirao` to `/result`.

---

#### ✅ B5 — `copa-group/page.tsx:274,287` — Ordinal suffix logic broken for non-1st/2nd positions
**File:** `frontend/src/app/copa-group/page.tsx`
**Lines:** 274, 287
**Problem:** 
- Qualified banner (line 274): `${userPosition === 0 ? "ST" : "ND"}` — 3rd place would show "3ND" instead of "3RD"; 4th would show "4ND".
- Eliminated banner (line 287): `${userPosition === 2 ? "RD" : "TH"}` — 1st place would show "1TH", 2nd would show "2TH".
These two branches contradict each other and neither is correct beyond the first two positions.
**Fix:** Use a proper ordinal helper:
```typescript
function ordinal(n: number) {
  if (n === 1) return "ST"; if (n === 2) return "ND"; if (n === 3) return "RD"; return "TH";
}
```
Then use `${userPosition + 1}${ordinal(userPosition + 1)}` in both banners.

---

#### ✅ B6 — `tournament.ts` — `generateOnlineTradicional` missing manager bonus in `simulateMatch` calls
**File:** `frontend/src/utils/tournament.ts`
**Problem:** The `simulateMatch` function signature in `tournament.ts` takes `homeManagerBonus` and `awayManagerBonus` as the last two parameters. The `generateOnlineTradicional` function omits these when calling `simulateMatch`, so all online Tradicional matches ignore manager bonuses entirely. This makes managers have zero effect in online mode.
**Fix:** Pass the correct `managerBonus` values when calling `simulateMatch` inside `generateOnlineTradicional`.

---

#### B7 — `draft/page.tsx` — World Cup draft skips last 2 player picks
**Status:** Root cause not yet identified.
**Problem:** In Copa do Mundo mode, the draft sequence jumps to manager selection before all 11 player slots are filled (skips the last 2 picks).
**Likely cause:** `drawNextTeam()` for Copa do Mundo only includes national team players. If a drawn team has fewer than 11 selectable players for the remaining slots (due to position overlap), the "free reroll" fires automatically and may incorrectly skip rounds. Investigate `drawNextTeam` logic and the condition `if (!currentDraftTeam && draftRound < 11)` in `draft/page.tsx:74`.

---

### 🟡 TRANSLATION GAPS

All items below are text visible to the user that is hardcoded in Portuguese without EN equivalents, violating the project's PT/EN requirement from CLAUDE.md.

#### ✅ T1 — `tournament/page.tsx:127` — Simulation mode toggle button
**Current:** `"Trocar para Simulação {X}"` (PT only)
**Fix:** Add lang check: `lang === "pt" ? "Trocar para Simulação X" : "Switch to X Simulation"`

---

#### ✅ T2 — `knockout/page.tsx:229` — Simulation mode toggle button
Same issue as T1. Both tournament and knockout pages have this identical PT-only button.
**Fix:** Same lang check pattern.

---

#### ✅ T3 — `draft/page.tsx:298` — Chemistry info button label
**Current:** `"COMO FUNCIONA O ENTROSAMENTO?"` (hardcoded PT)
**Fix:** Add to `tDraft` translation object: `chemBtn: "COMO FUNCIONA O ENTROSAMENTO?"` / `"HOW DOES CHEMISTRY WORK?"`

---

#### ✅ T4 — `draft/page.tsx:343,345,349,369,373` — Online waiting UI strings
All strings in the post-draft online waiting panel are hardcoded Portuguese:
- Line 343: `"Mostrar Resultados"` → `"Show Results"`
- Line 345: `"Aguardando o host mostrar os resultados..."` → `"Waiting for host to show results..."`
- Line 349: `"Aguardando outros jogadores..."` → `"Waiting for other players..."`
- Line 369: `"Pronto"` → `"Ready"`
- Line 373: `"Montando..."` → `"Building..."`
**Fix:** Add these to `tDraft` translation object.

---

#### ✅ T5 — `draft/page.tsx:551,562` — Player position assignment banners
**Current:**
- `"ESCOLHA A POSIÇÃO NO CAMPO PARA {name}"` (PT only)
- `"TROCAR POSIÇÃO DE {name}"` (PT only)
- `"CANCELAR"` (×2)
**Fix:** Add to `tDraft`: `choosePos`, `swapPos`, `cancel` keys with EN equivalents.

---

#### ✅ T6 — `draft/page.tsx:592-631` — Chemistry modal (entirely PT)
The entire chemistry explanation modal is in Portuguese:
- Title: `"Como funciona o Entrosamento?"`
- 6 tier descriptions (Verde/Green, Amarelo/Yellow, Laranja/Orange, etc.)
- Manager bonus section title and description
- Close button: `"Entendi"` → `"Got it"`
**Fix:** Replace all modal content with lang-aware strings. Either use `tDraft` or a local `tChem` object.

---

#### ✅ T7 — `draft/page.tsx:533-543` — Sector strength labels
**Current:** `"ATA:"`, `"MEI:"` displayed as PT abbreviations regardless of lang.
**Fix:** Use lang-aware labels: EN → `"ATK:"`, `"MID:"`, `"DEF:"` / PT → `"ATA:"`, `"MEI:"`, `"DEF:"`.

---

#### ✅ T8 — `copa-group/page.tsx` — Multiple PT-only strings
- Line 38-39: `"GRUPO {name}"` → `lang === "pt" ? "GRUPO" : "GROUP"`, `"SEU GRUPO"` → `"YOUR GROUP"`
- Line 47: `"Seleção"` table header → `lang === "pt" ? "Seleção" : "Team"`
- Line 84: `"Resultados"` section label → `lang === "pt" ? "Resultados" : "Results"`
(Note: the simulation mode toggle button on line 209-212 is already correctly translated.)

---

#### T9 — `online/page.tsx` — Entire page is Portuguese only
The entire online lobby browser page uses hardcoded PT strings with no language switching:
- Page title, tab labels, input labels, room list, room mode badges, create form, ranked modal — all PT.
**Fix:** Add `useLanguage()` and translate all visible text. This is a large but important fix since this is a core user-facing page.

---

#### T10 — `lobby/[id]/page.tsx` — Entire page is Portuguese only
Same issue as T9. All lobby UI text is hardcoded PT:
- "Conectando ao servidor...", "Entrar na Sala", "Carregando Sala...", "Chat Global", "Jogadores na Sala", "Iniciar Jogo", "Cancelar", "Sair", "Aguardando Host...", etc.
- All `alert()` messages (lines 62, 68, 113, 145) are PT strings.
- Kick confirmation modal text is all PT.
**Fix:** Add `useLanguage()` and translate. Also consider replacing `alert()` calls with inline error/toast notifications.

---

### 🔵 UX / QUALITY IMPROVEMENTS

#### U1 — `online/page.tsx` & `lobby/[id]/page.tsx` — `alert()` and `confirm()` dialogs
**Problem:** Several flows use browser `alert()` and `confirm()` for critical feedback (kick, cancel room, nickname validation, join errors). These are intrusive, can be blocked by browsers, and are language-unaware.
**Fix:** Replace with inline error messages, styled modals (the kick modal pattern already exists and is well-designed — extend it to other confirmations), or a toast notification system.

---

#### U2 — `copa-group/page.tsx` — Group table column headers not user-friendly
The group table uses football stat abbreviations (`J`, `V`, `E`, `D`, `SG`, `Pts`) which are Portuguese abbreviations. EN users may not know `V` = Wins, `E` = Draws, `D` = Losses, `SG` = Goal Difference.
**Fix:** For EN lang, use `GP` (games played), `W`, `D`, `L`, `GD`, `Pts` — or add tooltips showing the full label on hover.

---

#### U3 — `tournament/page.tsx` — "Qualified (Top 16)" label in TRANSLATIONS is hardcoded number
The `qualified_label` translation key says "Qualified (Top 16)" but this label also appears in the copa-group flow. In Copa do Mundo, only the top 2 per group qualify — a different threshold. This may cause a confusing mismatch if the label is ever reused across modes.
**Status:** Low priority since copa-group has its own qualification display. Monitor for reuse.

---

#### ✅ U4 — `result/page.tsx` — Brasileirão champion badge text
**Problem:** The result page `championBadge` translation is `"🏆 CAMPEÃO DO MUNDO!"` / `"🏆 WORLD CHAMPION!"`. For Brasileirão champions this is wrong — they're not world champion. Should show `"🏆 CAMPEÃO BRASILEIRO!"` / `"🏆 BRAZILIAN CHAMPION!"` for Brasileirão mode.
**Fix:** Make `championBadge` text mode-aware (same pattern as `tournamentTitle` already done on that page).

---

#### U5 — `online/page.tsx` — Difficulty selector hidden for Guerra mode but could be shown for Louco/Copa
Currently, the difficulty selector only shows when `mode === "tradicional"`. In `generateOnlineGuerra`, difficulty is irrelevant (pure PvP bracket). But for online Copa do Mundo and Brasileirão in Tradicional mode, difficulty IS passed through correctly. No bug, but worth confirming that `generateOnlineTradicional` handles Copa/Brasileirão AI team pools correctly (it receives `allTeams` which is computed mode-aware in draft/page.tsx).

---

#### U6 — `lobby/[id]/page.tsx` — Chat "Send" button is PT-only
Line 378: Button label `"Enviar"` hardcoded PT. Minor but inconsistent.
**Fix:** Translate with `useLanguage()`.

---

### 🟣 ARCHITECTURE / TECHNICAL DEBT

#### A1 — `simulation.ts` — `simulateMatch` function appears unused
The `simulateMatch` export in `simulation.ts` (simple Poisson implementation) is not called anywhere — `tournament.ts` has its own internal `simulateMatch` with sector-based calculation. Confirm and remove if unused to avoid confusion.

---

#### A2 — `constants.ts` — TRANSLATIONS object incomplete
Many pages bypass `TRANSLATIONS` entirely and use inline `lang === "pt" ? "..." : "..."` ternaries. This creates two translation patterns in the same codebase, making it hard to audit coverage. Long-term: consolidate all user-facing strings into `TRANSLATIONS` or a dedicated i18n file.

---

#### ✅ A3 — `draft/page.tsx:164` — TODO comment left in production code
Line 164: `// [TODO O RESTANTE DO CÓDIGO PERMANECE IDENTICO]` — this appears to be a leftover refactoring comment. Remove it.

---

#### A4 — `GameContext.tsx` — `startLeaguePhase` copa-do-mundo routing
When `tournamentMode === 'copa-do-mundo'` and the user somehow reaches `/tournament` (e.g., after a browser refresh that restores `phase === "league"`), `startLeaguePhase` runs instead of the Copa group stage, generating an incorrect tournament. The draft page correctly routes Copa do Mundo to `/copa-group`, but the `tournament/page.tsx` doesn't guard against this. Low priority since normal flow prevents it, but worth adding a redirect guard.

---

## 🗓️ Priority Suggestion

| Priority | Issues |
|----------|--------|
| **High (bugs)** | B4 (Brasileirão champion), B2 (draft animation), B7 (World Cup draft skip), B5 (ordinal suffix), B6 (online manager bonus) |
| **Medium (translation)** | T9 (online page), T10 (lobby page), T6 (chemistry modal), T4 (online waiting UI), T5 (position banners) |
| **Low (UX/debt)** | U1 (alerts), U4 (champion badge text), T1/T2/T3/T7/T8 (smaller strings), B3 (stale positions), A1/A2/A3/A4 |
