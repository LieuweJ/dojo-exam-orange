import { Move } from './boardState';

export const RULES_VIOLATIONS = {
  INVALID_MOVE: 'INVALID_MOVE',
} as const;

export type RuleViolation = keyof typeof RULES_VIOLATIONS;

export type IncorrectMove = {
  move: Move;
  violations: RuleViolation[];
};

export type RuleStrategy<Input> = {
  check(input: Input): RuleViolation[] | null;
};
