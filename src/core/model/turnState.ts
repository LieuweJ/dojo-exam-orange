import { IPlayer, NonEmptyArray } from './player';
import { IPiece } from './IPiece';

export type Players = NonEmptyArray<IPlayer>;

export type ITurnState = {
  nextPlayer: () => void;
  getCurrentPlayer(): IPlayer;
  getPlayers(): IPlayer[];
  currentPlayerOwnsPiece(piece: IPiece): boolean;
};

export class TurnState implements ITurnState {
  private playersPointer: number = 0;

  constructor(private readonly players: Players) {}

  nextPlayer(): void {
    this.playersPointer =
      this.playersPointer + 1 < this.players.length ? this.playersPointer + 1 : 0;
  }

  getPlayers(): IPlayer[] {
    return [...this.players];
  }

  getCurrentPlayer(): IPlayer {
    return this.players[this.playersPointer];
  }

  currentPlayerOwnsPiece = (piece: IPiece): boolean => {
    return this.players[this.playersPointer].hasPiece(piece);
  };
}
