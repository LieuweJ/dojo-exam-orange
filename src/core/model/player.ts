import { IBoard } from './boardState';
import { IMoveStrategy } from '../strategy/player/move-strategy';
import { Move } from './rules';

export type NonEmptyArray<T> = [T, ...T[]];

export type Piece = {
  boardValue: symbol;
};

export type Pieces = NonEmptyArray<Piece>;

interface IPlayer {
  getScreenName(): string;

  hasPiece(piece: Piece): boolean;

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

  hasPiece(piece: Piece): boolean {
    return this.pieces.includes(piece);
  }
}
