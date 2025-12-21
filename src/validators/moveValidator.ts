import { IValidator } from './inputOutputValidator';
import { EMPTY_CELL, IBoard, Move } from '../model/boardState';

export class MoveValidator implements IValidator<Move, IBoard> {
  isValid(move: Move, board: IBoard): boolean {
    const column = board[0][move.column];
    return column === EMPTY_CELL;
  }
}
