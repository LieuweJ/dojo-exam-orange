import { IBoard } from '../model/board';
import { IInputAdapter } from '../adapters/terminalInputAdapter';

export type IColumnInputHandler = {
  askFor(board: IBoard): Promise<number>;
}

export class ColumnInputHandler implements IColumnInputHandler {
  constructor(
    private readonly input: IInputAdapter,
  ) {}

  async askFor(board: IBoard): Promise<number> {
      const min = 1;
      const max = board[0].length;
      const raw = await this.input.ask(`Choose column (${min}-${max}):`);

      return Number(raw);
  }
}