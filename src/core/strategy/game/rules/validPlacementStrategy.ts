import { ProposedMove, RULES_VIOLATIONS, RuleStrategy, RuleViolation } from '../../../model/rules';

export class ValidPlacementStrategy implements RuleStrategy {
  check({ move, moveContext }: ProposedMove): RuleViolation[] | null {
    if (!moveContext.board.canAddMove(move)) {
      return [RULES_VIOLATIONS.INVALID_PLACEMENT];
    }

    return null;
  }
}
