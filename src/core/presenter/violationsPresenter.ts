import { IBoardPositionUiResolver, IOutputPresenter } from './boardPresenter';
import { IOutputAdapter } from '../adapters/terminalOutputAdapter';
import { BaseRuleViolationType, IncorrectMove, PlayerRuleViolationType } from '../model/rules';
import { LineConnectMoveRuleViolationType } from '../../sharedMechanics/connectLineGame/model/rules';

export const CONNECT_LINE_VIOLATION_MESSAGES: Record<
  PlayerRuleViolationType | LineConnectMoveRuleViolationType,
  string
> = {
  INVALID_PLACEMENT: 'The move cannot be placed on the board.',
  INVALID_PLAYER_TURN: "It's not the player's turn to make a move.",
};

export class ViolationsPresenter<
  ViolationType extends BaseRuleViolationType,
> implements IOutputPresenter<IncorrectMove<ViolationType>> {
  constructor(
    private readonly output: IOutputAdapter,
    private readonly violationMessages: Record<ViolationType, string>,
    private readonly boardCellToUi: Map<symbol, string>,
    private readonly boardPositionToUiResolver: IBoardPositionUiResolver<string>
  ) {}

  present({ move, violations }: IncorrectMove<ViolationType>): void {
    const violationMessages = violations.map(
      (violation) => this.violationMessages[violation.reason]
    );

    let violationString = '- unknown violation';
    if (violationMessages.length > 0) {
      violationString = `- ${violationMessages.join('\n- ')}`;
    }

    const outputMessage = `Invalid move: ${this.boardCellToUi.get(move.piece.getBoardValue())} at ${this.boardPositionToUiResolver.resolve(move.position)}:\n${violationString}`;

    this.output.render(outputMessage);
  }
}
