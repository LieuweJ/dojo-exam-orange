import { IBoard, Move } from '../../model/boardState';
import { IValidator } from '../../validators/inputOutputValidator';
import { IRuleChecker, RuleViolation } from '../../model/rules';

export type MoveForBoard = { move: Move; board: IBoard };

export class ProposedMoveStrategy implements IRuleChecker<MoveForBoard> {
  constructor(private readonly moveValidator: IValidator<Move, IBoard>) {}

  check({ move, board }: MoveForBoard): RuleViolation[] | null {
    if (!this.moveValidator.isValid(move, board)) {
      return ['INVALID_MOVE'];
    }

    return null;
  }
}
