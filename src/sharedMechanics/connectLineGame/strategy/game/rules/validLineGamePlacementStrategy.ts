import { ProposedMove, RuleStrategy, RuleViolation } from '../../../../../core/model/rules';
import { EMPTY_CELL } from '../../../../../core/model/boardState';
import {
  LINE_CONNECT_MOVE_RULES_VIOLATIONS,
  LineConnectMoveRuleViolationType,
} from '../../../model/rules';

export class ValidLineGamePlacementStrategy implements RuleStrategy<LineConnectMoveRuleViolationType> {
  check({
    move,
    moveContext,
  }: ProposedMove): RuleViolation<LineConnectMoveRuleViolationType>[] | null {
    const currentCell = moveContext.board.getBoardCellAt(move.position);

    if (currentCell.getBoardValue() === EMPTY_CELL.getBoardValue()) {
      return null;
    }

    return [{ reason: LINE_CONNECT_MOVE_RULES_VIOLATIONS.INVALID_PLACEMENT }];
  }
}
