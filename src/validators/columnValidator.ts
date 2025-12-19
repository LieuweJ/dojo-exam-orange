import { EMPTY_CELL, IBoard } from '../model/board';

export type IValidator<Input, Against> = {
  isValid(columnNumber: Input, board: Against): boolean;
}

export class ColumnValidator implements IValidator<number, IBoard> {
  isValid(columnNumber: number, board: IBoard): boolean {
    const column = board[0][columnNumber];
    return column === EMPTY_CELL;
  }
}