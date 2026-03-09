import { Move } from './rules';
import { IBoard } from './boardState';

export type IGameHistory = {
  record(move: Move): void;
  getRecordedMoves(): Move[];
  getInitialBoard(): IBoard;
};

export class GameHistory implements IGameHistory {
  private readonly initialBoard: IBoard;
  private readonly moves: Move[] = [];

  constructor(initialBoard: IBoard) {
    this.initialBoard = this.cloneBoard(initialBoard);
  }

  getInitialBoard(): IBoard {
    return this.cloneBoard(this.initialBoard);
  }

  record(move: Move): void {
    this.moves.push(move);
  }

  getRecordedMoves(): Move[] {
    return [...this.moves];
  }

  private cloneBoard(board: IBoard): IBoard {
    return board.map((row) => [...row]);
  }
}
