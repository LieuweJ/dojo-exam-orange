import {
  PLAYER_RULES_VIOLATIONS,
  PlayerRuleViolationType,
  ProposedMove,
  RuleStrategy,
  RuleViolation,
} from '../../../model/rules';

export class ValidPlayerTurnStrategy implements RuleStrategy<PlayerRuleViolationType> {
  check({ move, moveContext }: ProposedMove): RuleViolation<PlayerRuleViolationType>[] | null {
    if (!moveContext.turn.currentPlayerOwnsPiece(move.piece)) {
      return [{ reason: PLAYER_RULES_VIOLATIONS.INVALID_PLAYER_TURN }];
    }

    return null;
  }
}
