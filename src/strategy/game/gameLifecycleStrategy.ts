import { GAME_OUTCOME, GameOutcome } from './gameOutcomeStrategy';

export type IGameLifecycleStrategy = {
  isGameOver: (gameState: GameOutcome) => boolean;
};

export class GameLifecycleStrategy implements IGameLifecycleStrategy {
  isGameOver(gameOutcome: GameOutcome): boolean {
    return gameOutcome.type === GAME_OUTCOME.WIN || gameOutcome.type === GAME_OUTCOME.DRAW;
  }
}
