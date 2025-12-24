import { Move } from './rules';
import { Piece } from './player';

export const EMPTY_CELL = Symbol('.');

export type BoardCell = typeof EMPTY_CELL | Piece;

export type BoardPosition = { row: number; column: number };

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

  addMove(move: Move) {
    const {
      position: { row, column },
      piece,
    } = move;

    if (!this.canAddMove(move)) {
      throw new Error(`Cannot add boardPosition: {row: ${row}, column: ${column}} to the board.`);
    }

    this.board[row][column] = piece;
  }

  canAddMove({ position: { column, row } }: Move): boolean {
    if (!this.board[row]) {
      return false;
    }

    return this.board[row][column] === EMPTY_CELL;
  }
}
