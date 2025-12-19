import { IBoard } from '../model/board';
import { IInputAdapter } from '../adapters/terminalInputAdapter';
import { IValidator } from '../validators/columnValidator';
import { IOutputAdapter } from '../adapters/terminalOutputAdapter';

export type IColumnInputHandler = {
  askFor(board: IBoard): Promise<number>;
}

export class ColumnInputHandler implements IColumnInputHandler {
  constructor(
    private readonly input: IInputAdapter,
    private readonly output: IOutputAdapter,
    private readonly validator: IValidator<number, IBoard>
  ) {}

  async askFor(board: IBoard): Promise<number> {
    while (true) {
      const min = 1;
      const max = board[0].length;
      const raw = await this.input.ask(`Choose column (${min}-${max}):`);

      const column = this.mapToColumn(raw);

      if (!this.validator.isValid(column, board)) {
        this.output.render(`Column ${raw} is full or invalid. Please choose another column.`);

        continue;
      }

      return column;
    }
  }

  private mapToColumn(userInput: string): number {
    return Number(userInput) - 1;
  }
}