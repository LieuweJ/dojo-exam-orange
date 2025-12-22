import { IValidator } from './inputOutputValidator';
import { Move } from '../model/boardState';
import { MoveConstraints } from '../strategy/game/proposedMoveStrategy';

export class MoveValidator implements IValidator<Move, MoveConstraints> {
  isValid(move: Move, constraints: MoveConstraints): boolean {
    return constraints.canAddMove(move);
  }
}
