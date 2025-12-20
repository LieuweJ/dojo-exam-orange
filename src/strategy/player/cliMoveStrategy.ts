import { ColumnIndex, IBoard, Move, PlayerBoardMarker } from '../../model/boardState';
import { IInputAdapter } from '../../adapters/terminalInputAdapter';
import { IValidator } from '../../validators/availableColumnValidator';
import { IOutputAdapter } from '../../adapters/terminalOutputAdapter';

export type IMoveStrategy = {
  createNextMove(board: IBoard, marker: PlayerBoardMarker, displayName: string): Promise<Move>;
}

export class CliMoveStrategy implements IMoveStrategy {
  constructor(
    private readonly input: IInputAdapter,
    private readonly output: IOutputAdapter,
    private readonly validator: IValidator<number, IBoard, ColumnIndex>
  ) {}

  async createNextMove(board: IBoard, marker: PlayerBoardMarker, displayName: string): Promise<Move> {
    while (true) {
      const min = 1;
      const max = board[0].length;
      const raw = await this.input.ask(`It is ${displayName}'s turn.\nChoose column (${min}-${max}):`);

      const column = this.mapToColumn(raw);

      if (!this.validator.isValid(column, board)) {
        this.output.render(`Column ${raw} is full or invalid. Please choose another column.`);

        continue;
      }

      return {
        column,
        marker,
      }
    }
  }

  private mapToColumn(userInput: string): number {
    return Number(userInput) - 1;
  }
}