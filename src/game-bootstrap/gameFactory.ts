import { IInputAdapter } from '../core/adapters/terminalInputAdapter';
import { Game } from '../core/game';
import { GameSelectionService } from './gameSelectionService';
import { IOutputAdapter } from '../core/adapters/terminalOutputAdapter';
import { PlayerNameSelectionService } from './playerNameSelectionService';

type createGameInput = {
  inputAdapter: IInputAdapter;
  outputAdapter: IOutputAdapter;
};

export class GameFactory {
  constructor(
    private readonly inputAdapter: IInputAdapter,
    private readonly outputAdapter: IOutputAdapter,
    private readonly gameSelector: GameSelectionService,
    private readonly playerNameSelectionService: PlayerNameSelectionService
  ) {}

  async createGameFromUserSelection({}: createGameInput): Promise<Game | null> {
    const gameDescriptor = await this.gameSelector.selectGame();

    if (!gameDescriptor) {
      return null;
    }

    const playerNames = await this.playerNameSelectionService.selectPlayerNames(
      gameDescriptor.requiredPlayers
    );

    const composition = gameDescriptor.createComposition({
      inputAdapter: this.inputAdapter,
      outputAdapter: this.outputAdapter,
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
      composition.lifecycleStrategy,
      composition.moveHandler
    );
  }
}
