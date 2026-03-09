import { Move } from './rules';
import { IBoard } from './boardState';
import { IPlayer } from './player';

export type IGameHistory = {
  record(recordedMove: RecordedMove): void;
  getRecordedMoves(): RecordedMove[];
  getInitialBoard(): IBoard;
};

export type RecordedMove = {
  move: Move;
  player: IPlayer;
};

export class GameHistory implements IGameHistory {
  private readonly initialBoard: IBoard;
  private readonly historicMoves: RecordedMove[] = [];

  constructor(initialBoard: IBoard) {
    this.initialBoard = this.cloneBoard(initialBoard);
  }

  getInitialBoard(): IBoard {
    return this.cloneBoard(this.initialBoard);
  }

  record(recordedMove: RecordedMove): void {
    this.historicMoves.push(recordedMove);
  }

  getRecordedMoves(): RecordedMove[] {
    return [...this.historicMoves];
  }

  private cloneBoard(board: IBoard): IBoard {
    return board.map((row) => [...row]);
  }
}
