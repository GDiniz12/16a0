import { FormationType, FormationSlot, PositionCode } from "@/types";

type SlotDef = [PositionCode, number, number];

const FORMATION_DEFS: Record<FormationType, SlotDef[]> = {
  "4-3-3": [
    ["GOL", 50, 90],
    ["LD", 82, 70],
    ["ZAG", 62, 74],
    ["ZAG", 38, 74],
    ["LE", 18, 70],
    ["VOL", 50, 55],
    ["MC", 32, 45],
    ["MEI", 68, 45],
    ["PE", 15, 22],
    ["CA", 50, 12],
    ["PD", 85, 22],
  ],
  "4-4-2": [
    ["GOL", 50, 90],
    ["LD", 82, 70],
    ["ZAG", 62, 74],
    ["ZAG", 38, 74],
    ["LE", 18, 70],
    ["ME", 15, 48],
    ["MC", 38, 52],
    ["MC", 62, 52],
    ["MD", 85, 48],
    ["CA", 38, 18],
    ["CA", 62, 18],
  ],
  "3-4-3": [
    ["GOL", 50, 90],
    ["ZAG", 25, 72],
    ["ZAG", 50, 76],
    ["ZAG", 75, 72],
    ["ME", 15, 48],
    ["VOL", 38, 52],
    ["MC", 62, 52],
    ["MD", 85, 48],
    ["PE", 15, 22],
    ["CA", 50, 12],
    ["PD", 85, 22],
  ],
};

export function getFormationSlots(formation: FormationType): FormationSlot[] {
  return FORMATION_DEFS[formation].map((def, index) => ({
    id: index,
    position: def[0],
    // store the position code as label; UI will render language-specific labels
    label: def[0],
    x: def[1],
    y: def[2],
    player: undefined,
  }));
}

export function getFormationPositions(formation: FormationType): PositionCode[] {
  return FORMATION_DEFS[formation].map((def) => def[0]);
}
