import { Player } from "@/types";

/**
 * Generates a Poisson-distributed random number.
 */
export function poissonRandom(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

/**
 * Simulates a match between two teams.
 * Returns realistic goal counts based on team strengths.
 *
 * @param homeStrength - Average overall of home team (e.g., 85)
 * @param awayStrength - Average overall of away team
 */
export function simulateMatch(
  homeStrength: number,
  awayStrength: number
): { homeGoals: number; awayGoals: number } {
  // Base expected goals per team
  const BASE_GOALS = 1.25;
  const HOME_ADVANTAGE = 0.2;

  // Strength difference normalized (range roughly -15 to +15 overall points)
  const diff = homeStrength - awayStrength;

  // Each point of overall difference adjusts expected goals by ~0.04
  const homeExpected = Math.max(
    0.3,
    BASE_GOALS + HOME_ADVANTAGE + diff * 0.04
  );
  const awayExpected = Math.max(
    0.3,
    BASE_GOALS - diff * 0.04
  );

  let homeGoals = poissonRandom(homeExpected);
  let awayGoals = poissonRandom(awayExpected);

  // Clamp to reasonable range (0-7)
  homeGoals = Math.min(homeGoals, 7);
  awayGoals = Math.min(awayGoals, 7);

  return { homeGoals, awayGoals };
}

/**
 * Calculates the average overall rating of a squad.
 */
export function calculateTeamStrength(players: Player[]): number {
  if (players.length === 0) return 80;
  const total = players.reduce((sum, p) => sum + p.overall, 0);
  return total / players.length;
}

/**
 * Simulates a match and returns a full result object.
 */
export function simulateMatchResult(
  homeTeam: string,
  awayTeam: string,
  homeStrength: number,
  awayStrength: number
) {
  const { homeGoals, awayGoals } = simulateMatch(homeStrength, awayStrength);
  return {
    homeTeam,
    awayTeam,
    homeGoals,
    awayGoals,
  };
}
