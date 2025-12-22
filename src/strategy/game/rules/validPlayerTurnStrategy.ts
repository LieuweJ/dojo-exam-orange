import { ProposedMove, RULES_VIOLATIONS, RuleStrategy, RuleViolation } from '../../../model/rules';

export class ValidPlayerTurnStrategy implements RuleStrategy {
  check({ move, constraints }: ProposedMove): RuleViolation[] | null {
    if (!constraints.isCurrentPlayerMarker(move.marker)) {
      return [RULES_VIOLATIONS.INVALID_PLAYER_TURN];
    }

    return null;
  }
}
