import { ProposedMove, RULES_VIOLATIONS, RuleStrategy, RuleViolation } from '../../../model/rules';

export class ValidPlayerTurnStrategy implements RuleStrategy {
  check({ move, moveContext }: ProposedMove): RuleViolation[] | null {
    if (!moveContext.turn.currentPlayerOwnsPiece(move.piece)) {
      return [RULES_VIOLATIONS.INVALID_PLAYER_TURN];
    }

    return null;
  }
}
