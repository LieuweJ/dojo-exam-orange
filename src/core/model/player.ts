import { IBoard } from './boardState';
import { IMoveStrategy } from '../strategy/player/move-strategy';
import { Move } from './rules';
import { IPiece } from './IPiece';

export type NonEmptyArray<T> = [T, ...T[]];

export type Pieces = NonEmptyArray<IPiece>;

export type IPlayer = {
  getScreenName(): string;
  hasPiece(piece: IPiece): boolean;
  getNextMove(board: IBoard, players: IPlayer[]): Promise<Move>;
  getPieces(): Pieces;
};

export class Player implements IPlayer {
  constructor(
    private readonly name: string,
    private readonly strategy: IMoveStrategy,
    private readonly pieces: Pieces
  ) {}

  getScreenName(): string {
    return this.name;
  }

  getNextMove(board: IBoard, players: IPlayer[]): Promise<Move> {
    return this.strategy.createNextMove({
      context: {
        board,
        players,
      },
      currentPlayer: this,
    });
  }

  hasPiece(piece: IPiece): boolean {
    return this.pieces.includes(piece);
  }

  getPieces(): Pieces {
    return this.pieces;
  }
}
