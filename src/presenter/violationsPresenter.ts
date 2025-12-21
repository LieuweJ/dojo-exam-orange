import { BOARD_CELL_TO_UI, IOutputPresenter } from './boardPresenter';
import { IOutputAdapter } from '../adapters/terminalOutputAdapter';
import { IncorrectMove, RuleViolation } from '../model/rules';

export const VIOLATION_MESSAGES: Record<RuleViolation, string> = {
  INVALID_MOVE: 'The move cannot be placed on the board.',
};

export class ViolationsPresenter implements IOutputPresenter<IncorrectMove> {
  constructor(
    private readonly output: IOutputAdapter,
    private violationMessages: Record<RuleViolation, string>
  ) {}

  present({ move, violations }: IncorrectMove): void {
    const violationMessages = violations.map((violation) => this.violationMessages[violation]);

    let violationString = '- unknown violation';
    if (violationMessages.length > 0) {
      violationString = `- ${violationMessages.join('\n- ')}`;
    }

    const outputMessage = `Invalid move: ${BOARD_CELL_TO_UI.get(move.marker)} at column ${move.column}:\n${violationString}`;

    this.output.render(outputMessage);
  }
}
