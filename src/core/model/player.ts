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
  cloneWithPieces(pieces: Pieces): IPlayer;
  addPiece(piece: IPiece): void;
  removePiece(piece: IPiece): void;
};

export class Player implements IPlayer {
  constructor(
    private readonly name: string,
    private readonly strategy: IMoveStrategy,
    private pieces: Pieces
  ) {
    if (pieces.length === 0) {
      throw new Error('Player must have at least one piece.');
    }
  }

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
    return [this.pieces[0], ...this.pieces.slice(1)];
  }

  addPiece(piece: IPiece) {
    this.pieces.push(piece);
  }

  removePiece(piece: IPiece) {
    const filteredPieces = this.pieces.filter((p) => p !== piece);

    if (filteredPieces.length === 0) {
      throw new Error('Player must keep at least one piece.');
    }

    this.pieces = [filteredPieces[0], ...filteredPieces.slice(1)];
  }

  cloneWithPieces(pieces: Pieces): Player {
    return new Player(this.name, this.strategy, [...pieces]);
  }
}
