import { BoardPosition, IBoardState } from './boardState';

import { IPiece } from './IPiece';
import { ITurnState } from './turnState';

export const PLAYER_RULES_VIOLATIONS = {
  INVALID_PLAYER_TURN: 'INVALID_PLAYER_TURN',
} as const;

export type PlayerRuleViolationType =
  (typeof PLAYER_RULES_VIOLATIONS)[keyof typeof PLAYER_RULES_VIOLATIONS];

export type RuleViolation<ViolationType extends BaseRuleViolationType> = {
  reason: ViolationType;
};

export type BaseRuleViolationType = string;

export type Move = { position: BoardPosition; piece: IPiece };
export type IncorrectMove<ViolationType extends BaseRuleViolationType> = {
  move: Move;
  violations: RuleViolation<ViolationType>[];
};

export type RuleStrategy<ViolationType extends BaseRuleViolationType> = {
  check(input: ProposedMove): RuleViolation<ViolationType>[] | null;
};

export type MoveContext = { board: IBoardState; turn: ITurnState };
export type ProposedMove = { move: Move; moveContext: MoveContext };
