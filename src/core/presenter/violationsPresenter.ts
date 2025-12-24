import { IBoardPositionUiResolver, IOutputPresenter } from './boardPresenter';
import { IOutputAdapter } from '../adapters/terminalOutputAdapter';
import { IncorrectMove, RuleViolation } from '../model/rules';
import { BoardCell } from '../model/boardState';

export const VIOLATION_MESSAGES: Record<RuleViolation, string> = {
  INVALID_PLACEMENT: 'The move cannot be placed on the board.',
  INVALID_PLAYER_TURN: "It's not the player's turn to make a move.",
};

export class ViolationsPresenter implements IOutputPresenter<IncorrectMove> {
  constructor(
    private readonly output: IOutputAdapter,
    private readonly violationMessages: Record<RuleViolation, string>,
    private readonly boardCellToUi: Map<BoardCell, string>,
    private readonly boardPositionToUiResolver: IBoardPositionUiResolver<string>
  ) {}

  present({ move, violations }: IncorrectMove): void {
    const violationMessages = violations.map((violation) => this.violationMessages[violation]);

    let violationString = '- unknown violation';
    if (violationMessages.length > 0) {
      violationString = `- ${violationMessages.join('\n- ')}`;
    }

    const outputMessage = `Invalid move: ${this.boardCellToUi.get(move.piece)} at ${this.boardPositionToUiResolver.resolve(move.position)}:\n${violationString}`;

    this.output.render(outputMessage);
  }
}
