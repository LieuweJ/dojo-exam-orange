import {
  ProposedMove,
  RULES_VIOLATIONS,
  RuleStrategy,
  RuleViolation,
} from '../../../../../core/model/rules';

export class ValidTurnStrategy implements RuleStrategy {
  check({ move, moveContext }: ProposedMove): RuleViolation[] | null {
    const currentPosition = moveContext.board.getPiecePositionBy(move.piece);

    if (!currentPosition) {
      return [RULES_VIOLATIONS.INVALID_PLACEMENT];
    }

    const isMoveSameAsCurrentPosition =
      currentPosition.column === move.position.column && currentPosition.row === move.position.row;

    if (isMoveSameAsCurrentPosition) {
      return [RULES_VIOLATIONS.INVALID_PLACEMENT];
    }

    return null;
  }
}
