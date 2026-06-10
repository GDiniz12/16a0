import { LeagueTeam, MatchResult, KnockoutRound } from "@/types";
import { simulateMatch } from "./simulation";

interface TeamEntry {
  name: string;
  strength: number;
}

/**
 * Generates the league phase: 36 teams, 8 rounds each.
 * Uses a round-robin rotation algorithm.
 */
export function generateLeaguePhase(
  userTeamName: string,
  userStrength: number,
  allTeams: TeamEntry[]
): { userMatches: MatchResult[]; table: LeagueTeam[] } {
  // Ensure we have exactly 36 teams; fill if needed
  const teams = [...allTeams];

  // Initialize standings
  const standings: Record<
    string,
    {
      played: number;
      won: number;
      drawn: number;
      lost: number;
      goalsFor: number;
      goalsAgainst: number;
      avgOverall: number;
    }
  > = {};

  teams.forEach((t) => {
    standings[t.name] = {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      avgOverall: t.strength,
    };
  });

  const userMatches: MatchResult[] = [];
  const allMatches: MatchResult[] = [];

  // Round-robin scheduling for 8 rounds
  // Fix first team, rotate the rest
  const teamsCopy = [...teams];
  const fixed = teamsCopy[0];
  const rotating = teamsCopy.slice(1);

  for (let round = 0; round < 8; round++) {
    const roundTeams = [fixed, ...rotating];
    const halfLen = Math.floor(roundTeams.length / 2);

    // Generate pairings for this round
    for (let i = 0; i < halfLen; i++) {
      const home = roundTeams[i];
      const away = roundTeams[roundTeams.length - 1 - i];

      if (!home || !away) continue;

      // Alternate home/away based on round
      const actualHome = round % 2 === 0 ? home : away;
      const actualAway = round % 2 === 0 ? away : home;

      const { homeGoals, awayGoals } = simulateMatch(
        actualHome.strength,
        actualAway.strength
      );

      const match: MatchResult = {
        homeTeam: actualHome.name,
        awayTeam: actualAway.name,
        homeGoals,
        awayGoals,
      };

      allMatches.push(match);

      // Update standings for home team
      if (standings[actualHome.name]) {
        standings[actualHome.name].played++;
        standings[actualHome.name].goalsFor += homeGoals;
        standings[actualHome.name].goalsAgainst += awayGoals;
        if (homeGoals > awayGoals) {
          standings[actualHome.name].won++;
        } else if (homeGoals === awayGoals) {
          standings[actualHome.name].drawn++;
        } else {
          standings[actualHome.name].lost++;
        }
      }

      // Update standings for away team
      if (standings[actualAway.name]) {
        standings[actualAway.name].played++;
        standings[actualAway.name].goalsFor += awayGoals;
        standings[actualAway.name].goalsAgainst += homeGoals;
        if (awayGoals > homeGoals) {
          standings[actualAway.name].won++;
        } else if (awayGoals === homeGoals) {
          standings[actualAway.name].drawn++;
        } else {
          standings[actualAway.name].lost++;
        }
      }

      // Track user matches
      if (
        actualHome.name === userTeamName ||
        actualAway.name === userTeamName
      ) {
        userMatches.push(match);
      }
    }

    // Rotate: move last element of rotating to the front
    rotating.unshift(rotating.pop()!);
  }

  // Build sorted table
  const table: LeagueTeam[] = Object.entries(standings).map(
    ([name, stats]) => ({
      name,
      played: stats.played,
      won: stats.won,
      drawn: stats.drawn,
      lost: stats.lost,
      goalsFor: stats.goalsFor,
      goalsAgainst: stats.goalsAgainst,
      goalDifference: stats.goalsFor - stats.goalsAgainst,
      points: stats.won * 3 + stats.drawn,
      isUser: name === userTeamName,
      avgOverall: stats.avgOverall,
    })
  );

  // Sort: points desc, then GD desc, then GF desc
  table.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference)
      return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  return { userMatches, table };
}

/**
 * Checks if user qualified (top 16)
 */
export function checkQualification(
  table: LeagueTeam[],
  userTeamName: string
): { qualified: boolean; position: number } {
  const idx = table.findIndex((t) => t.name === userTeamName);
  const position = idx + 1;
  return {
    qualified: position <= 16,
    position,
  };
}

/**
 * Generates all knockout rounds until eliminated or champion.
 * R16, QF, SF = 2 legs; Final = 1 leg.
 */
export function generateKnockoutRounds(
  table: LeagueTeam[],
  userTeamName: string,
  userStrength: number
): KnockoutRound[] {
  const rounds: KnockoutRound[] = [];
  const roundNames = [
    "Round of 16",
    "Quarter-finals",
    "Semi-finals",
    "Final",
  ];

  // Get qualified teams (top 16) excluding user
  const qualified = table
    .slice(0, 16)
    .filter((t) => t.name !== userTeamName);

  // Shuffle to add randomness to matchups
  const shuffled = [...qualified].sort(() => Math.random() - 0.5);

  let currentUserStrength = userStrength;

  for (let i = 0; i < 4; i++) {
    const roundName = roundNames[i];
    const opponentIdx = Math.min(i, shuffled.length - 1);
    const opponent = shuffled[opponentIdx] || shuffled[0];

    if (!opponent) break;

    const oppStrength = opponent.avgOverall;

    if (roundName === "Final") {
      // Single match
      const { homeGoals, awayGoals } = simulateMatch(
        currentUserStrength,
        oppStrength
      );

      const leg1: MatchResult = {
        homeTeam: userTeamName,
        awayTeam: opponent.name,
        homeGoals,
        awayGoals,
      };

      let winner: string;
      if (homeGoals > awayGoals) {
        winner = userTeamName;
      } else if (awayGoals > homeGoals) {
        winner = opponent.name;
      } else {
        // Penalty shootout simulation (50/50 with slight advantage to stronger team)
        const userWins =
          Math.random() < 0.5 + (currentUserStrength - oppStrength) * 0.01;
        winner = userWins ? userTeamName : opponent.name;
      }

      rounds.push({
        round: roundName,
        userOpponent: opponent.name,
        leg1,
        winner,
        userAdvanced: winner === userTeamName,
      });
    } else {
      // Two-leg tie
      const leg1Result = simulateMatch(currentUserStrength, oppStrength);
      const leg2Result = simulateMatch(oppStrength, currentUserStrength);

      const leg1: MatchResult = {
        homeTeam: userTeamName,
        awayTeam: opponent.name,
        homeGoals: leg1Result.homeGoals,
        awayGoals: leg1Result.awayGoals,
      };

      const leg2: MatchResult = {
        homeTeam: opponent.name,
        awayTeam: userTeamName,
        homeGoals: leg2Result.homeGoals,
        awayGoals: leg2Result.awayGoals,
      };

      const userAgg =
        leg1Result.homeGoals + leg2Result.awayGoals;
      const oppAgg =
        leg1Result.awayGoals + leg2Result.homeGoals;

      let winner: string;
      if (userAgg > oppAgg) {
        winner = userTeamName;
      } else if (oppAgg > userAgg) {
        winner = opponent.name;
      } else {
        // Away-goals rule or penalties
        const userAway = leg2Result.awayGoals;
        const oppAway = leg1Result.awayGoals;
        if (userAway > oppAway) {
          winner = userTeamName;
        } else if (oppAway > userAway) {
          winner = opponent.name;
        } else {
          // Penalty shootout
          const userWins =
            Math.random() <
            0.5 + (currentUserStrength - oppStrength) * 0.01;
          winner = userWins ? userTeamName : opponent.name;
        }
      }

      rounds.push({
        round: roundName,
        userOpponent: opponent.name,
        leg1,
        leg2,
        winner,
        userAdvanced: winner === userTeamName,
      });
    }

    // If user was eliminated, stop
    if (!rounds[rounds.length - 1].userAdvanced) break;

    // Remove this opponent from pool
    const oppIdx = shuffled.indexOf(opponent);
    if (oppIdx !== -1) shuffled.splice(oppIdx, 1);
  }

  return rounds;
}
