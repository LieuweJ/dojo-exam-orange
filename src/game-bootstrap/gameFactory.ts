import { IInputAdapter } from '../core/adapters/terminalInputAdapter';
import { Game } from '../core/game';
import { IOutputAdapter } from '../core/adapters/terminalOutputAdapter';
import { PlayerNameSelectionService } from './playerNameSelectionService';
import { GameDescriptor } from './composition/games-config';

export class GameFactory {
  constructor(
    private readonly inputAdapter: IInputAdapter,
    private readonly outputAdapter: IOutputAdapter,
    private readonly playerNameSelectionService: PlayerNameSelectionService
  ) {}

  async create(gameDescriptor: GameDescriptor): Promise<Game> {
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
      composition.moveHandler,
      composition.gameHistory
    );
  }
}
