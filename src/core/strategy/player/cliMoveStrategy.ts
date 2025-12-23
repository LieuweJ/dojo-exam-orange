import { IBoard, PlayerBoardMarker } from '../../model/boardState';
import { IInputAdapter } from '../../adapters/terminalInputAdapter';
import { IOutputAdapter } from '../../adapters/terminalOutputAdapter';
import { BOARD_CELL_TO_UI } from '../../presenter/boardPresenter';
import { Move } from '../../model/rules';

export type IMoveStrategy = {
  createNextMove(board: IBoard, marker: PlayerBoardMarker, displayName: string): Promise<Move>;
};

export class CliMoveStrategy implements IMoveStrategy {
  constructor(
    private readonly input: IInputAdapter,
    private readonly output: IOutputAdapter
  ) {}

  async createNextMove(
    board: IBoard,
    marker: PlayerBoardMarker,
    displayName: string
  ): Promise<Move> {
    while (true) {
      const raw = await this.input.ask(
        `It is ${displayName}'s turn.\nChoose column (1-${board[0].length}) for ${BOARD_CELL_TO_UI.get(marker)} : `
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

  isValid(input: string): boolean {
    return /^\d+$/.test(input);
  }

  private mapToColumn(userInput: string): number {
    return Number(userInput) - 1;
  }
}
