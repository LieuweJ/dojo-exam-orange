import { Piece, Player } from './player';

export type ITurnState = {
  nextPlayer: () => void;
  getCurrentPlayer(): Player;
  getPlayers(): Player[];
};

export type TurnConstraint = {
  currentPlayerOwnsPiece(piece: Piece): boolean;
};

export class TurnState implements ITurnState, TurnConstraint {
  playersPointer: number = 0;
  players: Player[];

  constructor({ players }: { players: Player[] }) {
    if (players.length < 2) {
      throw new Error(`In order to play this game, we need at least 2 players.`);
    }

    this.players = players;
  }

  nextPlayer(): void {
    this.playersPointer = this.playersPointer === 0 ? 1 : 0;
  }

  getPlayers(): Player[] {
    return this.players;
  }

  getCurrentPlayer = (): Player => {
    return this.players[this.playersPointer];
  };

  currentPlayerOwnsPiece = (piece: Piece): boolean => {
    return this.players[this.playersPointer].hasPiece(piece);
  };
}
