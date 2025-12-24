import { Move } from './rules';
import { Piece } from './player';

export const EMPTY_CELL = Symbol('.');

export type BoardCell = typeof EMPTY_CELL | Piece;

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
      throw new Error(`Cannot add move to column ${position}.`);
    }

    for (let row = this.board.length - 1; row >= 0; row--) {
      if (this.board[row][position] === EMPTY_CELL) {
        this.board[row][position] = piece;
        return;
      }
    }
  }

  canAddMove({ position }: Move): boolean {
    const isInteger = Number.isInteger(position);
    const isInBounds = position >= 0 && position < this.board[0].length;

    return isInteger && isInBounds && this.board[0][position] === EMPTY_CELL;
  }
}
