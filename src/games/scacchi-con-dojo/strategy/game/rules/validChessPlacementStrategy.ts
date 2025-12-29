import { RuleStrategy, RuleViolation } from '../../../../../core/model/rules';
import { ProposedChessMove } from '../../../model/move';
import { CHESS_RULE_VIOLATION_TYPES, ChessRuleViolationType } from './violationTypes';

export class ValidChessPlacementStrategy implements RuleStrategy<ChessRuleViolationType> {
  check({
    move: { piece, position },
    moveContext,
  }: ProposedChessMove): RuleViolation<ChessRuleViolationType>[] | null {
    const currentPosition = moveContext.board.getPiecePositionBy(piece);

    if (!currentPosition) {
      return [{ reason: CHESS_RULE_VIOLATION_TYPES.INVALID_PLACEMENT }];
    }

    const isMoveSameAsCurrentPosition =
      currentPosition.column === position.column && currentPosition.row === position.row;

    if (isMoveSameAsCurrentPosition) {
      return [{ reason: CHESS_RULE_VIOLATION_TYPES.INVALID_PLACEMENT }];
    }

    if (!piece.canReachPosition(position, moveContext.board)) {
      return [{ reason: CHESS_RULE_VIOLATION_TYPES.INVALID_PLACEMENT }];
    }

    return null;
  }
}
