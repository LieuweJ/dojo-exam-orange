import { IInputAdapter, TerminalInputAdapter } from './core/adapters/terminalInputAdapter';
import { IOutputAdapter, TerminalOutputAdapter } from './core/adapters/terminalOutputAdapter';
import { GameFactory, IGameFactory } from './game-bootstrap/gameFactory';
import {
  GameDescriptor,
  LISTED_GAMES,
  UNLISTED_GAMES,
} from './game-bootstrap/composition/games-config';
import {
  MainMenuSelectionService,
  IMenuSelectionService,
} from './game-bootstrap/mainMenuSelectionService';
import { PlayerSelectionService } from './game-bootstrap/playerSelectionService';
import { IGame } from './core/game';

type IMainInput = {
  inputAdapter: IInputAdapter;
  outputAdapter: IOutputAdapter;
  mainMenuService: IMenuSelectionService<GameDescriptor | null>;
  gameFactory: IGameFactory<IGame>;
};

async function main({ inputAdapter, outputAdapter, mainMenuService, gameFactory }: IMainInput) {
  try {
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
    outputAdapter.render('An unexpected error occurred.');
    console.error(error);
  } finally {
    inputAdapter.close();
  }
}

const inputAdapter = new TerminalInputAdapter(process.stdin, process.stdout);
const outputAdapter = new TerminalOutputAdapter();

main({
  inputAdapter,
  outputAdapter,
  mainMenuService: new MainMenuSelectionService(
    inputAdapter,
    outputAdapter,
    LISTED_GAMES,
    UNLISTED_GAMES
  ),
  gameFactory: new GameFactory(
    inputAdapter,
    outputAdapter,
    new PlayerSelectionService(inputAdapter, outputAdapter)
  ),
});
