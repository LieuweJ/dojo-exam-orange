import fs from 'fs';
import path from 'path';
import { IOutputAdapter } from '../adapters/terminalOutputAdapter';
import { IOutputPresenter } from './boardPresenter';

export class HelpPresenter implements IOutputPresenter<void> {
  constructor(
    private readonly output: IOutputAdapter,
    private readonly filePath: string
  ) {}

  present(): void {
    const rulesPath = path.resolve(process.cwd(), this.filePath);

    try {
      const rules = fs.readFileSync(rulesPath, 'utf-8');

      this.output.render(rules);
    } catch (error) {
      let errorMessage = 'Unknown error when trying to read the file.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      this.output.render(`Error: Unable to load the rules of play. ${errorMessage}`);
    }
  }
}
