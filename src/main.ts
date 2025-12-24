import { TerminalInputAdapter } from './core/adapters/terminalInputAdapter';
import { GameSelectionService } from './game-bootstrap/gameSelectionService';
import { GAMES } from './game-bootstrap/composition/games-config';
import { Game } from './core/game';
import { TerminalOutputAdapter } from './core/adapters/terminalOutputAdapter';

async function main() {
  const inputAdapter = new TerminalInputAdapter();
  const outputAdapter = new TerminalOutputAdapter();
  try {
    const selector = new GameSelectionService(inputAdapter, outputAdapter, GAMES);

    const gameDescriptor = await selector.selectGame();
    const playerNames = await selector.collectPlayerNames(gameDescriptor.requiredPlayers);

    const composition = gameDescriptor.createComposition({
      inputAdapter,
      outputAdapter,
      playerNames,
    });

    const game = new Game(
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

    await game.play();
  } catch (error) {
    console.error('An error occurred while starting the game:', error);
  } finally {
    inputAdapter.close();
  }
}

main();
