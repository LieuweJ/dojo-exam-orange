import { IInputAdapter } from '../core/adapters/terminalInputAdapter';
import { Game, IGame } from '../core/game';
import { IOutputAdapter } from '../core/adapters/terminalOutputAdapter';
import { PlayerSelectionService } from './playerSelectionService';
import { GameDescriptor } from './composition/games-config';

export type IGameFactory<Game extends IGame> = {
  create(gameDescriptor: GameDescriptor): Promise<Game>;
};

export class GameFactory implements IGameFactory<Game> {
  constructor(
    private readonly inputAdapter: IInputAdapter,
    private readonly outputAdapter: IOutputAdapter,
    private readonly playerNameSelectionService: PlayerSelectionService
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
