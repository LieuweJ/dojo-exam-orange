import { Move } from './rules';

import { IPiece } from './IPiece';

type IEmptyCell = {
  readonly getBoardValue: () => symbol;
};

export class EmptyCell implements IEmptyCell {
  constructor(private readonly id: symbol) {}

  getBoardValue(): symbol {
    return this.id;
  }
}

export const EMPTY_CELL_SYMBOL = Symbol('.');

export const EMPTY_CELL = new EmptyCell(EMPTY_CELL_SYMBOL);

export type BoardCell = IEmptyCell | IPiece;

export type BoardPosition = { row: number; column: number };

export type IBoard = BoardCell[][];

export type IBoardState = {
  getBoard(): IBoard;
  addMove(move: Move): void;
  getPositionBy(piece: IPiece): BoardPosition | undefined;
  clearPosition(position: BoardPosition): void;
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

  clearPosition(position: BoardPosition) {
    const { row, column } = position;

    if (this.board[row] && this.board[row][column]) {
      this.board[row][column] = EMPTY_CELL;
    }
  }

  getPositionBy(piece: IPiece): BoardPosition | undefined {
    for (let row = 0; row < this.board.length; row++) {
      for (let column = 0; column < this.board[row].length; column++) {
        if (this.board[row][column] === piece) {
          return { row, column };
        }
      }
    }

    return undefined;
  }
}
