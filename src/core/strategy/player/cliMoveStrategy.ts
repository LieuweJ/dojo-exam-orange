import { BoardCell, IBoard } from '../../model/boardState';
import { IInputAdapter } from '../../adapters/terminalInputAdapter';
import { IOutputAdapter } from '../../adapters/terminalOutputAdapter';
import { Move } from '../../model/rules';
import { Pieces } from '../../model/player';

export type IMoveStrategy = {
  createNextMove(board: IBoard, pieces: Pieces, displayName: string): Promise<Move>;
};

export class CliMoveStrategy implements IMoveStrategy {
  constructor(
    private readonly input: IInputAdapter,
    private readonly output: IOutputAdapter,
    private readonly boardCellToUi: Map<BoardCell, string>
  ) {}

  async createNextMove(board: IBoard, pieces: Pieces, displayName: string): Promise<Move> {
    const defaultPiece = pieces[0];
    while (true) {
      const raw = await this.input.ask(
        `It is ${displayName}'s turn.\nChoose column (1-${board[0].length}) for ${this.boardCellToUi.get(defaultPiece)} : `
      );

      if (!this.isValid(raw)) {
        this.output.render(`Column ${raw} is invalid. Please choose another column.`);

        continue;
      }

      return {
        position: this.mapToColumn(raw),
        piece: defaultPiece,
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
