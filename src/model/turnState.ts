import { MARKER_O, MARKER_X, PlayerBoardMarker } from './boardState';
import { Player } from './player';

export type PlayersByMarker = Record<PlayerBoardMarker, Player>;

export type ITurnState = {
  nextPlayer: () => void;
  getCurrentPlayer(): Player;
  getCurrentPlayerMarker: () => PlayerBoardMarker;
  getPlayers(): PlayersByMarker;
};

export type TurnConstraint = {
  isCurrentPlayer(marker: PlayerBoardMarker): boolean;
};

export class TurnState implements ITurnState {
  currentPlayerMarker: PlayerBoardMarker = MARKER_X;
  players: PlayersByMarker;

  constructor(players: PlayersByMarker) {
    if (!players[MARKER_X]) {
      throw new Error(`Player for marker ${MARKER_X.toString()} is missing.`);
    }

    if (!players[MARKER_O]) {
      throw new Error(`Player for marker ${MARKER_O.toString()} is missing.`);
    }

    this.players = players;
  }

  nextPlayer(): void {
    this.currentPlayerMarker = this.isCurrentPlayer(MARKER_X) ? MARKER_O : MARKER_X;
  }

  getPlayers(): PlayersByMarker {
    return this.players;
  }

  getCurrentPlayer = (): Player => {
    return this.players[this.currentPlayerMarker];
  };

  getCurrentPlayerMarker = (): PlayerBoardMarker => {
    return this.currentPlayerMarker;
  };

  isCurrentPlayer = (marker: PlayerBoardMarker): boolean => {
    return this.currentPlayerMarker === marker;
  };
}
