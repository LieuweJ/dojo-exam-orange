import { RuleStrategy, RuleViolation } from '../../../../../core/model/rules';
import { CHESS_RULE_VIOLATION_TYPES, ChessRuleViolationType } from './violationTypes';
import { ProposedChessMove } from '../../../model/move';
import { KingInCheckDetector } from '../../../detector/KingInCheckDetector';
import { ChessMoveHandler } from '../../../handler/ChessMoveHandler';
import { ChessPiece } from '../../../model/chessPiece';

export class IsCurrentPlayerKingInCheckStrategy implements RuleStrategy<ChessRuleViolationType> {
  constructor(
    private readonly kingInCheckDetector: KingInCheckDetector,
    private readonly moveHandler: ChessMoveHandler
  ) {}

  check({
    move: { piece, position, promotionKind },
    moveContext,
  }: ProposedChessMove): RuleViolation<ChessRuleViolationType>[] | null {
    const { board } = moveContext;

    const clonedBoard = board.clone();

    const clonedPosition = board.getPiecePositionBy(piece);

    if (!clonedPosition) {
      throw new Error('Piece to move not found on the board');
    }
    const clonedPiece = clonedBoard.getBoardCellAt(clonedPosition);

    if (!(clonedPiece instanceof ChessPiece)) {
      throw new Error('Cloned piece is not a valid ChessPiece');
    }

    this.moveHandler.handle(
      {
        piece: clonedPiece,
        position,
        promotionKind,
      },
      clonedBoard
    );

    const currentTeam = piece.getTeam();

    if (this.kingInCheckDetector.isInCheck({ board: clonedBoard, team: currentTeam })) {
      return [{ reason: CHESS_RULE_VIOLATION_TYPES.INVALID_OWN_KING_IN_CHECK }];
    }

    return null;
  }
}
