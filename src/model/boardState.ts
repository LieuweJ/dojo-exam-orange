import { Move } from './rules';

export const EMPTY_CELL = Symbol('.');
export const MARKER_X = Symbol('x');
export const MARKER_O = Symbol('o');

export type I_EMPTY_CELL = typeof EMPTY_CELL;
export type I_MARKER_X = typeof MARKER_X;
export type I_MARKER_O = typeof MARKER_O;
export type PlayerBoardMarker = Exclude<BoardCell, I_EMPTY_CELL>;

export type BoardCell = I_EMPTY_CELL | I_MARKER_X | I_MARKER_O;
export type ColumnIndex = number & { readonly __brand: 'ColumnIndex' };

export type IBoard = BoardCell[][];

export type IBoardState = {
  getBoard(): IBoard;
  addMove(move: Move): void;
};

export type BoardConstraint = {
  canAddMove(move: Move): boolean;
};

export class BoardState implements IBoardState, BoardConstraint {
  constructor(private board: IBoard) {}

  getBoard() {
    return this.board.map((row) => [...row]);
  }

  addMove({ column, marker }: Move) {
    if (!this.canAddMove({ column, marker })) {
      throw new Error(`Cannot add move to column ${column}.`);
    }

    for (let row = this.board.length - 1; row >= 0; row--) {
      if (this.board[row][column] === EMPTY_CELL) {
        this.board[row][column] = marker;
        return;
      }
    }
  }

  canAddMove({ column }: Move): boolean {
    return this.board[0][column] === EMPTY_CELL;
  }
}
