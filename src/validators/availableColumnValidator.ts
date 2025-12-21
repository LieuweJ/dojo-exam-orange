import { EMPTY_CELL, IBoard } from '../model/boardState';

export type IValidator<Input, Against> = {
  isValid(input: Input, against: Against): boolean;
};

export class AvailableColumnValidator implements IValidator<number, IBoard> {
  isValid(columnNumber: number, board: IBoard): boolean {
    const column = board[0][columnNumber];
    return column === EMPTY_CELL;
  }
}
