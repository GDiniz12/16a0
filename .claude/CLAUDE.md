# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**vs11** is a football (soccer) draft simulation game where players build squads from historical Libertadores and Champions League legends, then simulate tournaments. It supports both offline single-player and online multiplayer modes.

## Architecture

The project is a monorepo with two independently-run services:

- `frontend/` — Next.js 14 app (App Router, TypeScript, Tailwind CSS, Framer Motion)
- `server/` — Node.js/Express server using Socket.IO for real-time multiplayer

### Frontend Structure

- `src/app/` — Next.js App Router pages. Each folder is a route:
  - `formation/` → pick formation
  - `draft/` → draft players round-by-round
  - `tournament/` → league phase
  - `knockout/` → elimination rounds
  - `result/` → final result screen
  - `online/` → lobby browser (online mode)
  - `lobby/[id]/` → room lobby with Socket.IO
- `src/context/` — Three React contexts that coordinate game state:
  - `GameContext.tsx` — all offline game state (phase, slots, formation, league, knockout). Also handles loading online tournament data via `setOnlineTournamentState`.
  - `SocketContext.tsx` — Socket.IO connection, room state, nickname, and mobile reconnection logic.
  - `LanguageContext.tsx` — PT/EN language toggle (persisted in localStorage).
- `src/data/data.ts` — All player data. Teams are keyed by `"club-year"` (e.g. `"flamengo-2019"`), grouped into `americans` and `europeans`. Each player entry is `[name, overall, positions[], nationality_flag]`. Also exports `managersData`.
- `src/utils/simulation.ts` — Poisson-based match simulation. Factors in team strength diff, tactic (defensive/balanced/offensive), difficulty modifier, and chemistry bonus.
- `src/utils/tournament.ts` — Generates league phase (group stage) and knockout bracket logic.
- `src/utils/helpers.ts` — `calculateTeamChemistry`, `getManagerBonus`, `getRandomTeam`, etc.
- `src/utils/formations.ts` — Maps `FormationType` to `FormationSlot[]` with pitch coordinates.
- `src/lib/constants.ts` — `TRANSLATIONS` (PT/EN), `POSITION_LABELS_MAP`, `POSITION_COLORS`, color palette.
- `src/types/index.ts` — All shared TypeScript types (`Player`, `Manager`, `FormationSlot`, `MatchResult`, `LeagueTeam`, `KnockoutRound`, `GamePhase`, etc.).

### Position Code System

Positions use Portuguese abbreviations internally (`GOL`, `LD`, `ZAG`, `LE`, `VOL`, `MC`, `MEI`, `ME`, `MD`, `PE`, `PD`, `CA`). `getPositionLabel(pos, lang)` in `constants.ts` translates to English equivalents (GK, RB, CB, etc.) for display.

### Game Flow (Offline)

`GamePhase` progresses: `home → formation → draft → league → knockout → result`

The draft loops through rounds: `drawNextTeam()` picks a random historical squad; the player picks one player per round plus a manager pick. After all 11 slots are filled, `startLeaguePhase()` generates a 32-team league. Top 16 advance to `startKnockoutPhase()` (two-legged ties).

### Multiplayer Flow

1. Players connect via `SocketContext` to the server on `NEXT_PUBLIC_SOCKET_URL`.
2. One player creates a room (modes: `tradicional` or `guerra`); others join via room ID.
3. Host calls `startGame` → server emits `gameStarted` → all players enter draft.
4. Each player emits `playerDraftComplete` with their `teamData` when done.
5. Server waits for all players, then emits `allDraftsComplete` with everyone's data and the host ID.
6. Frontend calls `setOnlineTournamentState` on `GameContext` to load the online data into the normal tournament flow.
7. Mobile reconnection: server holds a 15s timer on disconnect before removing a player, allowing `rejoinRoom` to resume.

### Server (server/index.js)

Single-file server. Rooms are stored in memory (`rooms` object) — there is no database. Room passwords are stripped before broadcasting (`getSafeRoom`). The server reads `FRONTEND_URL` and `PORT` from `.env`.

## Development Commands

### Frontend

```bash
cd frontend
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
```

### Server

```bash
cd server
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start without nodemon
```

### Environment Variables

`frontend/.env.local`:
```
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

`server/.env`:
```
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Key Conventions

- All text visible to the user must support PT and EN. Add entries to both language objects in `TRANSLATIONS` (constants.ts) and use `useLanguage()` to get `lang`, then index translations with `t[lang]` or `translations[lang]`.
- Player/team data lives exclusively in `src/data/data.ts`. To add a team, add an entry to `americans` or `europeans` with the `"club-year"` key pattern and the 11-player array format.
- The simulation is intentionally deterministic-ish (Poisson random) — changes to `simulation.ts` directly affect match fairness and difficulty balance.
- `GameContext` persists state to `localStorage` via `useEffect` watchers and restores it on mount (for browser refresh recovery).
