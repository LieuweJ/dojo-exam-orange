import { IInputAdapter } from '../core/adapters/terminalInputAdapter';
import { GameDescriptor } from './composition/games-config';
import { IOutputAdapter } from '../core/adapters/terminalOutputAdapter';

type IGameSelectionService = {
  selectGame(): Promise<GameDescriptor>;
  collectPlayerNames(count: number): Promise<string[]>;
};

export class GameSelectionService implements IGameSelectionService {
  constructor(
    private readonly input: IInputAdapter,
    private readonly outputAdapter: IOutputAdapter,
    private readonly games: GameDescriptor[]
  ) {
    if (games.length === 0) {
      throw new Error('No games registered.');
    }
  }

  async selectGame(): Promise<GameDescriptor> {
    while (true) {
      const menu = this.games.map((game, index) => `${index + 1}. ${game.displayName}`).join('\n');

      const answer = await this.input.ask(`What do you want to play?\n${menu}\nChoose a number: `);

      const index = Number(answer) - 1;

      if (!Number.isInteger(index) || !this.games[index]) {
        this.outputAdapter.render('Invalid choice. Please select a valid game.');
        continue;
      }

      return this.games[index];
    }
  }

  async collectPlayerNames(playerCount: number): Promise<string[]> {
    const names: string[] = [];

    for (let i = 0; i < playerCount; i++) {
      while (true) {
        const name = await this.input.ask(`Enter name for Player ${i + 1}: `);

        if (!name.trim()) {
          this.outputAdapter.render('Name cannot be empty.');
          continue;
        }

        names.push(name.trim());
        break;
      }
    }

    return names;
  }
}
