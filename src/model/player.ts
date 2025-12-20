import { IBoard, Move, PlayerBoardMarker } from './boardState';
import { IMoveStrategy } from '../strategy/player/cliMoveStrategy';

interface IPlayer {
  getScreenName(): string;
  getNextMove(board: IBoard, marker: PlayerBoardMarker): Promise<Move>;
}

export class Player implements IPlayer {
  constructor(
    private readonly name: string,
    private readonly strategy: IMoveStrategy
  ) {}

  getScreenName(): string {
    return this.name;
  }

  getNextMove(board: IBoard, marker: PlayerBoardMarker): Promise<Move> {
    return this.strategy.createNextMove(board, marker, this.getScreenName());
  }
}