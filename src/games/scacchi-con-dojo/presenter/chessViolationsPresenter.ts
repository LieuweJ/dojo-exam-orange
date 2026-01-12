import { BaseRuleViolationType, IncorrectMove } from '../../../core/model/rules';
import { IBoardPositionUiResolver, IOutputPresenter } from '../../../core/presenter/boardPresenter';
import { IOutputAdapter } from '../../../core/adapters/terminalOutputAdapter';
import { ChessPieceKind } from '../config/chessPiecesConfig';
import { ChessPieceUi } from '../composition/chessComposition';
import { ChessPiece } from '../model/chessPiece';
import { IPiece } from '../../../core/model/IPiece';

const UNKNOWN_PIECE_UI = 'unknown piece';

export class ChessViolationsPresenter<
  ViolationType extends BaseRuleViolationType,
> implements IOutputPresenter<IncorrectMove<ViolationType>> {
  constructor(
    private readonly output: IOutputAdapter,
    private readonly violationMessages: Record<ViolationType, string>,
    private readonly pieceUi: Map<ChessPieceKind, ChessPieceUi>,
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

    const outputMessage = `Invalid move: ${this.renderChessPiece(move.piece)} at ${this.boardPositionToUiResolver.resolve(move.position)}:\n${violationString}`;

    this.output.render(outputMessage);
  }

  private renderChessPiece(piece: IPiece): string {
    if (!(piece instanceof ChessPiece)) {
      return UNKNOWN_PIECE_UI;
    }

    const pieceUi = this.pieceUi.get(piece.getKind());

    return pieceUi?.get(piece.getTeam()) ?? UNKNOWN_PIECE_UI;
  }
}
