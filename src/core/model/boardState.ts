import { Move } from './rules';
import { Piece } from './player';

export const EMPTY_CELL = Symbol('.');

export type BoardCell = typeof EMPTY_CELL | Piece;

export type BoardPosition = { row?: number; column: number };

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

  addMove({ position, piece }: Move) {
    if (!this.canAddMove({ position, piece })) {
      throw new Error(`Cannot add move to column ${position.column}.`);
    }

    const column = position.column;

    for (let row = this.board.length - 1; row >= 0; row--) {
      if (this.board[row][column] === EMPTY_CELL) {
        this.board[row][column] = piece;
        return;
      }
    }
  }

  canAddMove({ position: { column } }: Move): boolean {
    const isInteger = Number.isInteger(column);
    const isInBounds = column >= 0 && column < this.board[0].length;

    return isInteger && isInBounds && this.board[0][column] === EMPTY_CELL;
  }
}
