import { IInputAdapter } from '../core/adapters/terminalInputAdapter';
import { GameDescriptor } from './composition/games-config';
import { IOutputAdapter } from '../core/adapters/terminalOutputAdapter';

type IGameSelectionService = {
  selectGame(): Promise<GameDescriptor | null>;
};

export class GameSelectionService implements IGameSelectionService {
  constructor(
    private readonly input: IInputAdapter,
    private readonly outputAdapter: IOutputAdapter,
    private readonly listedGames: GameDescriptor[],
    private readonly unlistedGames: Map<string, GameDescriptor>
  ) {
    if (this.listedGames.length === 0) {
      throw new Error('No games registered.');
    }
  }

  async selectGame(): Promise<GameDescriptor | null> {
    while (true) {
      const menu = this.listedGames
        .map((game, index) => `${index + 1}. ${game.displayName}`)
        .concat(`${this.listedGames.length + 1}. Quit`)
        .join('\n');

      const answer = await this.input.ask(
        `What would you like to play?\n${menu}\n\nChoose a number: `
      );

      const unlistedSelection = this.unlistedGames.get(answer.trim());

      if (unlistedSelection) {
        return unlistedSelection;
      }

      const index = Number(answer) - 1;

      if (index === this.listedGames.length) {
        return null;
      }

      if (!Number.isInteger(index) || !this.listedGames[index]) {
        this.outputAdapter.render('Invalid choice. Please select a valid game.');
        continue;
      }

      return this.listedGames[index];
    }
  }
}
