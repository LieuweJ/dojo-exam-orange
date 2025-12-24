import { BoardPosition, IBoard } from '../../model/boardState';
import { Player } from '../../model/player';

export const GAME_OUTCOME = {
  ONGOING: 'ONGOING',
  DRAW: 'DRAW',
  WIN: 'WIN',
} as const;

export type GameOutComeDraw = { type: typeof GAME_OUTCOME.DRAW };
export type GameOutcomeOngoing = { type: typeof GAME_OUTCOME.ONGOING };
export type GameOutComeWin = {
  type: typeof GAME_OUTCOME.WIN;
  winner: Player;
  winningPositions: BoardPosition[];
};

export type GameOutcome = GameOutComeDraw | GameOutcomeOngoing | GameOutComeWin;

export type IGameOutcomeStrategy = {
  determine(board: IBoard, players: Player[]): GameOutcome;
};
