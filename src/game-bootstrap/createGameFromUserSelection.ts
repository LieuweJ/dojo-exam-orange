import { IInputAdapter } from '../core/adapters/terminalInputAdapter';
import { GAMES } from './composition/games-config';
import { Game } from '../core/game';
import { GameSelectionService } from './gameSelectionService';
import { IOutputAdapter } from '../core/adapters/terminalOutputAdapter';

type createGameInput = {
  inputAdapter: IInputAdapter;
  outputAdapter: IOutputAdapter;
};

export async function createGameFromUserSelection({
  inputAdapter,
  outputAdapter,
}: createGameInput): Promise<Game> {
  const gameSelector = new GameSelectionService(inputAdapter, outputAdapter, GAMES);

  const gameDescriptor = await gameSelector.selectGame();
  const playerNames = await gameSelector.collectPlayerNames(gameDescriptor.requiredPlayers);

  const composition = gameDescriptor.createComposition({
    inputAdapter,
    outputAdapter,
    playerNames,
  });

  return new Game(
    composition.turnState,
    composition.boardState,
    composition.boardPresenter,
    composition.helpPresenter,
    composition.outcomeStrategy,
    composition.resultPresenter,
    composition.rulesChecker,
    composition.violationPresenter,
    composition.lifecycleStrategy
  );
}
