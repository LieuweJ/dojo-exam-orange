import { BoardPosition, IBoardState } from './boardState';
import { TurnConstraint } from './turnState';

import { IPiece } from './IPiece';

export const RULES_VIOLATIONS = {
  INVALID_PLACEMENT: 'INVALID_PLACEMENT',
  INVALID_PLAYER_TURN: 'INVALID_PLAYER_TURN',
} as const;

export type RuleViolation = keyof typeof RULES_VIOLATIONS;

export type Move = { position: BoardPosition; piece: IPiece };
export type IncorrectMove = {
  move: Move;
  violations: RuleViolation[];
};

export type RuleStrategy = {
  check(input: ProposedMove): RuleViolation[] | null;
};

export type MoveContext = { board: IBoardState; turn: TurnConstraint };
export type ProposedMove = { move: Move; moveContext: MoveContext };
