export const EMPTY_CELL = Symbol('.');
export const MARKER_X = Symbol('+');
export const MARKER_O = Symbol('-');

export type I_EMPTY_CELL = typeof EMPTY_CELL;
export type I_MARKER_X = typeof MARKER_X;
export type I_MARKER_O = typeof MARKER_O;

export type BoardCell = I_EMPTY_CELL | I_MARKER_X | I_MARKER_O;
type RowIndex = 1 | 2 | 3 | 4 | 5 | 6;
type Move = {row: RowIndex, marker: Exclude<BoardCell, I_EMPTY_CELL>;}

export type IBoard = BoardCell[][];

export type IBoardClass = {
  getBoard(): IBoard;
}

export class Board implements IBoardClass {
  private board: IBoard = [
    [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
  ];

  getBoard() {
    return this.board.map(row => [...row]);
  }
}