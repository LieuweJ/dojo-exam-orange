import { IBoardConstraints, Move } from '../../model/boardState';
import { IValidator } from '../../validators/inputOutputValidator';
import { IRuleChecker, RuleViolation } from '../../model/rules';

export type MoveConstraints = IBoardConstraints;

export type MoveForBoard = { move: Move; constraints: MoveConstraints };

export class ProposedMoveStrategy implements IRuleChecker<MoveForBoard> {
  constructor(private readonly moveValidator: IValidator<Move, MoveConstraints>) {}

  check({ move, constraints }: MoveForBoard): RuleViolation[] | null {
    if (!this.moveValidator.isValid(move, constraints)) {
      return ['INVALID_MOVE'];
    }

    return null;
  }
}
