import { Player, PositionCode, FormationSlot, TeamData } from "@/types";
import { POSITION_LABELS_MAP } from "@/lib/constants";

type RawTeamData = Record<string, [string, number, PositionCode[]][]>;

/**
 * Converts a team key to a display name.
 * "real-madrid-2017" → "Real Madrid 2017"
 */
export function formatTeamName(key: string): string {
  return key
    .split("-")
    .map((word) => {
      // If it's a number (year), return as-is
      if (/^\d+$/.test(word)) return word;
      // Capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/**
 * Gets a random team from the data.
 * Randomly chooses continent first, then randomly picks a team.
 */
export function getRandomTeam(
  americans: RawTeamData,
  europeans: RawTeamData
): TeamData {
  const continent = Math.random() < 0.5 ? "american" : "european";
  const data = continent === "american" ? americans : europeans;
  const keys = Object.keys(data);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const rawPlayers = data[randomKey];

  const players: Player[] = rawPlayers.map((p) => ({
    name: p[0],
    overall: p[1],
    positions: p[2] as PositionCode[],
    teamName: formatTeamName(randomKey),
    teamKey: randomKey,
  }));

  return {
    key: randomKey,
    name: formatTeamName(randomKey),
    players,
    continent,
  };
}

/**
 * Returns all teams as TeamData array.
 */
export function getAllTeams(
  americans: RawTeamData,
  europeans: RawTeamData
): TeamData[] {
  const teams: TeamData[] = [];

  for (const [key, rawPlayers] of Object.entries(americans)) {
    const players: Player[] = rawPlayers.map((p) => ({
      name: p[0],
      overall: p[1],
      positions: p[2] as PositionCode[],
      teamName: formatTeamName(key),
      teamKey: key,
    }));
    teams.push({
      key,
      name: formatTeamName(key),
      players,
      continent: "american",
    });
  }

  for (const [key, rawPlayers] of Object.entries(europeans)) {
    const players: Player[] = rawPlayers.map((p) => ({
      name: p[0],
      overall: p[1],
      positions: p[2] as PositionCode[],
      teamName: formatTeamName(key),
      teamKey: key,
    }));
    teams.push({
      key,
      name: formatTeamName(key),
      players,
      continent: "european",
    });
  }

  return teams;
}

/**
 * Fisher-Yates shuffle. Returns a new array.
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Checks if a player can fill a specific position.
 */
export function canPlayerFillPosition(
  playerPositions: PositionCode[],
  slotPosition: PositionCode
): boolean {
  return playerPositions.includes(slotPosition);
}

/**
 * Returns the IDs of empty slots that a player can fill.
 */
export function getAvailablePositions(
  slots: FormationSlot[],
  playerPositions: PositionCode[]
): number[] {
  return slots
    .filter(
      (slot) =>
        !slot.player && playerPositions.includes(slot.position)
    )
    .map((slot) => slot.id);
}

/**
 * Returns the remaining empty positions in the formation.
 */
export function getRemainingPositions(
  slots: FormationSlot[]
): PositionCode[] {
  return slots
    .filter((slot) => !slot.player)
    .map((slot) => slot.position);
}

/**
 * Checks if a player can fill ANY of the remaining empty slots.
 */
export function canPlayerFillAnyRemaining(
  playerPositions: PositionCode[],
  slots: FormationSlot[]
): boolean {
  return slots.some(
    (slot) =>
      !slot.player && playerPositions.includes(slot.position)
  );
}

/**
 * Position label helper
 */
export function getPositionLabel(pos: PositionCode, lang: string = "en"): string {
  return (POSITION_LABELS_MAP[lang] && POSITION_LABELS_MAP[lang][pos]) || pos;
}
