import { Move } from './rules';
import { IPiece } from './IPiece';

export class EmptyCell {
  constructor(private readonly id: symbol) {}

  getBoardValue(): symbol {
    return this.id;
  }
}

export const EMPTY_CELL_SYMBOL = Symbol('.');

export const EMPTY_CELL = new EmptyCell(EMPTY_CELL_SYMBOL);

export type BoardCell = EmptyCell | IPiece;

export type BoardPosition = { row: number; column: number };

export type IBoard = BoardCell[][];

export type IBoardState = {
  getBoard(): IBoard;
  addMove(move: Move): void;
  getPiecePositionBy(piece: IPiece): BoardPosition | undefined;
  clearPosition(position: BoardPosition): void;
  getBoardCellAt(position: BoardPosition): BoardCell;
};

export class BoardState implements IBoardState {
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

    return this.board[row][column] !== undefined;
  }

  clearPosition(position: BoardPosition) {
    const { row, column } = position;

    if (this.board[row] && this.board[row][column]) {
      this.board[row][column] = EMPTY_CELL;
    }
  }

  getPiecePositionBy(piece: IPiece): BoardPosition | undefined {
    for (let row = 0; row < this.board.length; row++) {
      for (let column = 0; column < this.board[row].length; column++) {
        if (this.board[row][column] === piece) {
          return { row, column };
        }
      }
    }

    return undefined;
  }

  getBoardCellAt(position: BoardPosition): BoardCell {
    const { row, column } = position;
    return this.board[row][column];
  }

  clone(): BoardState {
    const board = this.getBoard();

    const clonedBoard: BoardCell[][] = board.map((row) =>
      row.map((cell) => {
        if (cell instanceof EmptyCell) {
          return cell;
        }

        return cell.clone();
      })
    );

    return new BoardState(clonedBoard);
  }
}
