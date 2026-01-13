import { IInputAdapter } from '../core/adapters/terminalInputAdapter';
import { IOutputAdapter } from '../core/adapters/terminalOutputAdapter';

type IPlayerNameSelectionService = {
  selectPlayerNames(count: number): Promise<string[]>;
};

export class PlayerNameSelectionService implements IPlayerNameSelectionService {
  private previousPlayerNames: string[] = [];

  constructor(
    private readonly input: IInputAdapter,
    private readonly outputAdapter: IOutputAdapter
  ) {}

  async selectPlayerNames(playerCount: number): Promise<string[]> {
    const names: string[] = [];

    for (let i = 0; i < playerCount; i++) {
      while (true) {
        const previousName = this.previousPlayerNames[i] || null;

        const previousNameUi = previousName ? ` [${previousName}]` : '';

        const name = await this.input.ask(`Enter name for Player ${i + 1}${previousNameUi}: `);

        if (name === '' && previousName) {
          names.push(previousName);
          break;
        }

        const trimmedName = name.trim();

        if (!trimmedName) {
          this.outputAdapter.render('Name cannot be empty.');
          continue;
        }

        if (names.includes(trimmedName)) {
          this.outputAdapter.render('Name must be unique. Please choose another name.');
          continue;
        }

        this.previousPlayerNames[i] = name;
        names.push(trimmedName);
        break;
      }
    }

    return names;
  }
}
