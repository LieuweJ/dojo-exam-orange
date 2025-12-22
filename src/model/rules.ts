import { BoardConstraint, PlayerBoardMarker } from './boardState';
import { TurnConstraint } from './turnState';

export const RULES_VIOLATIONS = {
  INVALID_PLACEMENT: 'INVALID_PLACEMENT',
  INVALID_PLAYER_TURN: 'INVALID_PLAYER_TURN',
} as const;

export type RuleViolation = keyof typeof RULES_VIOLATIONS;

export type Move = { column: number; marker: PlayerBoardMarker };
export type IncorrectMove = {
  move: Move;
  violations: RuleViolation[];
};

export type RuleStrategy = {
  check(input: ProposedMove): RuleViolation[] | null;
};

export type MoveConstraints = BoardConstraint & TurnConstraint;
export type ProposedMove = { move: Move; constraints: MoveConstraints };
