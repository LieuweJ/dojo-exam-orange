import { IMoveStrategy } from '../../../../core/strategy/player/move-strategy';
import { IInputAdapter } from '../../../../core/adapters/terminalInputAdapter';
import { IOutputAdapter } from '../../../../core/adapters/terminalOutputAdapter';
import { BoardCell, BoardPosition, IBoard } from '../../../../core/model/boardState';
import { IBoardPositionResolver } from '../../../../core/resolvers/MoveResolver';
import { Pieces } from '../../../../core/model/player';
import { Move } from '../../../../core/model/rules';
import { CliPositionResolverArgs } from '../../resolvers/cliInputResolver';

export class CliMoveStrategy implements IMoveStrategy {
  constructor(
    private readonly input: IInputAdapter,
    private readonly output: IOutputAdapter,
    private readonly boardCellToUi: Map<BoardCell, string>,
    private readonly positionResolver: IBoardPositionResolver<CliPositionResolverArgs>
  ) {}

  async createNextMove(board: IBoard, pieces: Pieces, displayName: string): Promise<Move> {
    const defaultPiece = pieces[0];

    while (true) {
      const raw = await this.input.ask(
        `It is ${displayName}'s turn.\n` +
          `Choose a position (e.g. a1, b2, c3) for ${this.boardCellToUi.get(defaultPiece)}: `
      );

      if (!this.isValid(raw)) {
        this.output.render(`Input '${raw}' is invalid. Please use a format like 'a1'.`);
        continue;
      }

      let position: BoardPosition;

      try {
        position = this.positionResolver.resolve({
          userInput: raw,
          board,
        });
      } catch {
        this.output.render(
          `Input '${raw}' cannot be placed on the board. Please choose another position.`
        );
        continue;
      }

      return {
        position,
        piece: defaultPiece,
      };
    }
  }

  private isValid(input: string): boolean {
    return /^[a-zA-Z]\d$/.test(input);
  }
}
