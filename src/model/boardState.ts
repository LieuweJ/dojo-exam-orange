export const EMPTY_CELL = Symbol('.');
export const MARKER_X  = Symbol('x');
export const MARKER_O  = Symbol('o');

export type I_EMPTY_CELL = typeof EMPTY_CELL;
export type I_MARKER_X = typeof MARKER_X;
export type I_MARKER_O = typeof MARKER_O;
export type PlayerBoardMarker = Exclude<BoardCell, I_EMPTY_CELL>;

export type BoardCell = I_EMPTY_CELL | I_MARKER_X | I_MARKER_O;
export type ColumnIndex = number & { readonly __brand: 'ColumnIndex' };
export type Move = {column: ColumnIndex, marker: PlayerBoardMarker;}

export type IBoard = BoardCell[][];

export type IBoardState = {
  getBoard(): IBoard;
  addMove(move: Move): void;
}

export class BoardState implements IBoardState {
  constructor(private board: IBoard) {}

  getBoard() {
    return this.board.map(row => [...row]);
  }

  addMove({ column, marker }: Move) {
    for (let row = this.board.length - 1; row >= 0; row--) {
      if (this.board[row][column] === EMPTY_CELL) {
        this.board[row][column] = marker;
        return;
      }
    }

    throw new Error(`Board column ${column} is full or invalid.`);
  }
}