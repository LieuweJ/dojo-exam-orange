import fs from 'fs';
import path from 'path';
import { IOutputAdapter } from '../adapters/outputAdapter';
import { IPresenter } from './boardPresenter';

export class RulesPresenter implements IPresenter<void> {
  constructor(
    private readonly output: IOutputAdapter,
    private readonly filePath: string
  ) {}

  present(): void {
    const rulesPath = path.resolve(process.cwd(), this.filePath);

    try {
      const rules = fs.readFileSync(
        rulesPath,
        'utf-8',
      );

      this.output.render(rules);
    } catch (error) {
      this.output.render('Error: Unable to load the rules of play.');
    }
  }
}
