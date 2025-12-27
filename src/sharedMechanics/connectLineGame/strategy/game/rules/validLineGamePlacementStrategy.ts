import {
  ProposedMove,
  RULES_VIOLATIONS,
  RuleStrategy,
  RuleViolation,
} from '../../../../../core/model/rules';
import { EMPTY_CELL } from '../../../../../core/model/boardState';

export class ValidLineGamePlacementStrategy implements RuleStrategy {
  check({ move, moveContext }: ProposedMove): RuleViolation[] | null {
    const currentCell = moveContext.board.getBoardCellAt(move.position);

    if (currentCell.getBoardValue() === EMPTY_CELL.getBoardValue()) {
      return null;
    }

    return [RULES_VIOLATIONS.INVALID_PLACEMENT];
  }
}
