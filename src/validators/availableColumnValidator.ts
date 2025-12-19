import { ColumnIndex, EMPTY_CELL, IBoard } from '../model/board';

export type IValidator<Input, Against, ValidType extends Input> = {
  isValid(input: Input, against: Against): input is ValidType;
};

export class AvailableColumnValidator implements IValidator<number, IBoard, ColumnIndex> {
  isValid(columnNumber: number, board: IBoard): columnNumber is ColumnIndex {
    const column = board[0][columnNumber];
    return column === EMPTY_CELL;
  }
}