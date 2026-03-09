import { TerminalInputAdapter } from './core/adapters/terminalInputAdapter';
import { TerminalOutputAdapter } from './core/adapters/terminalOutputAdapter';
import { GameFactory } from './game-bootstrap/gameFactory';
import { LISTED_GAMES, UNLISTED_GAMES } from './game-bootstrap/composition/games-config';
import { MainMenuSelectionService } from './game-bootstrap/mainMenuSelectionService';
import { PlayerSelectionService } from './game-bootstrap/playerSelectionService';

async function main() {
  let outputAdapter: TerminalOutputAdapter | undefined;
  let inputAdapter: TerminalInputAdapter | undefined;

  try {
    inputAdapter = new TerminalInputAdapter(process.stdin, process.stdout);
    outputAdapter = new TerminalOutputAdapter();

    const mainMenuService = new MainMenuSelectionService(
      inputAdapter,
      outputAdapter,
      LISTED_GAMES,
      UNLISTED_GAMES
    );

    const gameFactory = new GameFactory(
      inputAdapter,
      outputAdapter,
      new PlayerSelectionService(inputAdapter, outputAdapter)
    );

    while (true) {
      const userSelection = await mainMenuService.select();

      if (!userSelection) {
        outputAdapter.render('\nOtsukaresama deshita!\n');
        return;
      }

      const game = await gameFactory.create(userSelection);

      await game.play();

      outputAdapter.render('\nPractice makes perfect!');
    }
  } catch (error) {
    if (outputAdapter) {
      outputAdapter.render('An unexpected error occurred.');
    }

    console.error(error);
  } finally {
    if (inputAdapter) {
      inputAdapter.close();
    }
  }
}

main();
