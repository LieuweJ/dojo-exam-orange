import { BoardCell, IBoard, PlayerBoardMarker } from '../../model/boardState';
import { IInputAdapter } from '../../adapters/terminalInputAdapter';
import { IOutputAdapter } from '../../adapters/terminalOutputAdapter';
import { Move } from '../../model/rules';

export type IMoveStrategy = {
  createNextMove(board: IBoard, marker: PlayerBoardMarker, displayName: string): Promise<Move>;
};

export class CliMoveStrategy implements IMoveStrategy {
  constructor(
    private readonly input: IInputAdapter,
    private readonly output: IOutputAdapter,
    private readonly boardCellToUi: Map<BoardCell, string>
  ) {}

  async createNextMove(
    board: IBoard,
    marker: PlayerBoardMarker,
    displayName: string
  ): Promise<Move> {
    while (true) {
      const raw = await this.input.ask(
        `It is ${displayName}'s turn.\nChoose column (1-${board[0].length}) for ${this.boardCellToUi.get(marker)} : `
      );

      if (!this.isValid(raw)) {
        this.output.render(`Column ${raw} is invalid. Please choose another column.`);

        continue;
      }

      return {
        column: this.mapToColumn(raw),
        marker,
      };
    }
  }

  private isValid(input: string): boolean {
    return /^\d+$/.test(input);
  }

  private mapToColumn(userInput: string): number {
    return Number(userInput) - 1;
  }
}
