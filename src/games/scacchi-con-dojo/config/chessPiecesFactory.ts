import { RelativeMovement } from '../model/piece';

export const ROOK_MOVEMENT: Set<RelativeMovement> = new Set([
  { direction: [{ row: -1, column: 0 }], maxSteps: Infinity }, // up
  { direction: [{ row: 1, column: 0 }], maxSteps: Infinity }, // down
  { direction: [{ row: 0, column: -1 }], maxSteps: Infinity }, // left
  { direction: [{ row: 0, column: 1 }], maxSteps: Infinity }, // right
]);
