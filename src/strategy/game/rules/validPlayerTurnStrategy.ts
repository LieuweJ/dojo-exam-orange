import { ProposedMove, RULES_VIOLATIONS, RuleStrategy, RuleViolation } from '../../../model/rules';

export class ValidPlayerTurnStrategy implements RuleStrategy<ProposedMove> {
  check({ move, constraints }: ProposedMove): RuleViolation[] | null {
    if (!constraints.isCurrentPlayer(move.marker)) {
      return [RULES_VIOLATIONS.INVALID_PLAYER_TURN];
    }

    return null;
  }
}
