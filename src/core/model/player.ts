import { IBoard, PlayerBoardMarker } from './boardState';
import { IMoveStrategy } from '../strategy/player/cliMoveStrategy';
import { Move } from './rules';

export type NonEmptyArray<T> = [T, ...T[]];

export type Pieces = NonEmptyArray<PlayerBoardMarker>;

interface IPlayer {
  getScreenName(): string;

  hasPiece(piece: PlayerBoardMarker): boolean;

  getNextMove(board: IBoard): Promise<Move>;
}

export class Player implements IPlayer {
  constructor(
    private readonly name: string,
    private readonly strategy: IMoveStrategy,
    private readonly pieces: Pieces
  ) {}

  getScreenName(): string {
    return this.name;
  }

  getNextMove(board: IBoard): Promise<Move> {
    return this.strategy.createNextMove(board, this.pieces, this.getScreenName());
  }

  hasPiece(piece: PlayerBoardMarker): boolean {
    return this.pieces.includes(piece);
  }
}
