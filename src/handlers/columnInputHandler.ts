import { ColumnIndex, IBoard, Move } from '../model/board';
import { IInputAdapter } from '../adapters/terminalInputAdapter';
import { IValidator } from '../validators/availableColumnValidator';
import { IOutputAdapter } from '../adapters/terminalOutputAdapter';
import { Player } from '../model/player';

export type IColumnInputHandler = {
  askFor(board: IBoard, player: Player): Promise<ColumnIndex>;
}

export class ColumnInputHandler implements IColumnInputHandler {
  constructor(
    private readonly input: IInputAdapter,
    private readonly output: IOutputAdapter,
    private readonly validator: IValidator<number, IBoard, ColumnIndex>
  ) {}

  async askFor(board: IBoard, player: Player): Promise<ColumnIndex> {
    while (true) {
      const min = 1;
      const max = board[0].length;
      const raw = await this.input.ask(`It is ${player.getScreenName()}'s turn.\nChoose column (${min}-${max}):`);

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