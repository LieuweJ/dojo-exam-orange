import { ProposedMove, RULES_VIOLATIONS, RuleStrategy, RuleViolation } from '../../../model/rules';

export class ValidPlacementStrategy implements RuleStrategy {
  check({ move, constraints }: ProposedMove): RuleViolation[] | null {
    if (!constraints.canAddMove(move)) {
      return [RULES_VIOLATIONS.INVALID_PLACEMENT];
    }

    return null;
  }
}
