import { TerminalInputAdapter } from './core/adapters/terminalInputAdapter';
import { TerminalOutputAdapter } from './core/adapters/terminalOutputAdapter';
import { GameFactory } from './game-bootstrap/gameFactory';
import { LISTED_GAMES, UNLISTED_GAMES } from './game-bootstrap/composition/games-config';
import { GameSelectionService } from './game-bootstrap/gameSelectionService';
import { PlayerNameSelectionService } from './game-bootstrap/playerNameSelectionService';

async function main() {
  const inputAdapter = new TerminalInputAdapter(process.stdin, process.stdout);
  const outputAdapter = new TerminalOutputAdapter();
  const gameSelectionService = new GameSelectionService(
    inputAdapter,
    outputAdapter,
    LISTED_GAMES,
    UNLISTED_GAMES
  );
  const playerNameSelectionService = new PlayerNameSelectionService(inputAdapter, outputAdapter);

  const gameFactory = new GameFactory(inputAdapter, outputAdapter, playerNameSelectionService);

  try {
    while (true) {
      const gameDescriptor = await gameSelectionService.selectGame();

      if (!gameDescriptor) {
        outputAdapter.render('\nOtsukaresama deshita!\n');
        return;
      }

      const game = await gameFactory.create(gameDescriptor);

      await game.play();

      outputAdapter.render('\nPractice makes perfect!');
    }
  } catch (error) {
    outputAdapter.render('An unexpected error occurred.');
    console.error(error);
  } finally {
    inputAdapter.close();
  }
}

main();
