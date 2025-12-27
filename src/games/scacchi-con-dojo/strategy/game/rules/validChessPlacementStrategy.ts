import { RULES_VIOLATIONS, RuleStrategy, RuleViolation } from '../../../../../core/model/rules';
import { ProposedChessMove } from '../../../model/move';

export class ValidChessPlacementStrategy implements RuleStrategy {
  check({ move: { piece, position }, moveContext }: ProposedChessMove): RuleViolation[] | null {
    const currentPosition = moveContext.board.getPiecePositionBy(piece);

    if (!currentPosition) {
      return [RULES_VIOLATIONS.INVALID_PLACEMENT];
    }

    const isMoveSameAsCurrentPosition =
      currentPosition.column === position.column && currentPosition.row === position.row;

    if (isMoveSameAsCurrentPosition) {
      return [RULES_VIOLATIONS.INVALID_PLACEMENT];
    }

    if (!piece.canReachPosition(position, moveContext.board)) {
      return [RULES_VIOLATIONS.INVALID_PLACEMENT];
    }

    return null;
  }
}
