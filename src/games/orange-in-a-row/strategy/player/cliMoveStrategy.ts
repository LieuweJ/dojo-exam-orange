import { IInputAdapter } from '../../../../core/adapters/terminalInputAdapter';
import { IOutputAdapter } from '../../../../core/adapters/terminalOutputAdapter';
import { BoardPosition, IBoard } from '../../../../core/model/boardState';
import { IBoardPositionResolver } from '../../../../core/resolvers/MoveResolver';
import { CliPositionResolverArgs } from '../../resolvers/cliColumnInputResolver';
import { Pieces } from '../../../../core/model/player';
import { Move } from '../../../../core/model/rules';
import { IMoveStrategy } from '../../../../core/strategy/player/move-strategy';

export class CliMoveStrategy implements IMoveStrategy {
  constructor(
    private readonly input: IInputAdapter,
    private readonly output: IOutputAdapter,
    private readonly boardCellToUi: Map<symbol, string>,
    private readonly rowResolver: IBoardPositionResolver<CliPositionResolverArgs>
  ) {}

  async createNextMove(board: IBoard, pieces: Pieces, displayName: string): Promise<Move> {
    const defaultPiece = pieces[0];
    while (true) {
      const raw = await this.input.ask(
        `It is ${displayName}'s turn.\nChoose column (1-${board[0].length}) for ${this.boardCellToUi.get(defaultPiece.getBoardValue())} : `
      );

      if (!this.isValid(raw)) {
        this.output.render(`Column ${raw} is invalid. Please choose another column.`);

        continue;
      }

      let position: BoardPosition;

      try {
        position = this.rowResolver.resolve({
          column: this.mapToColumn(raw),
          board,
        });
      } catch {
        this.output.render(
          `Input (column ${raw}) cannot be placed on the board. Please choose another column.`
        );

        continue;
      }

      return {
        position: position,
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
