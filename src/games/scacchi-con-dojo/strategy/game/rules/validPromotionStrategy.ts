import { RuleStrategy, RuleViolation } from '../../../../../core/model/rules';
import { ProposedChessMove } from '../../../model/move';
import { ChessPiecePawn } from '../../../model/chessPiecePawn';
import { CHESS_PIECE_KIND, ChessPieceKind } from '../../../config/chessPiecesConfig';
import { CHESS_RULE_VIOLATION_TYPES, ChessRuleViolationType } from './violationTypes';

const ALLOWED_PROMOTIONS: ReadonlySet<ChessPieceKind> = new Set([
  CHESS_PIECE_KIND.QUEEN,
  CHESS_PIECE_KIND.ROOK,
  CHESS_PIECE_KIND.BISHOP,
  CHESS_PIECE_KIND.KNIGHT,
]);

export class ValidPromotionStrategy implements RuleStrategy<ChessRuleViolationType> {
  check({ move, moveContext }: ProposedChessMove): RuleViolation<ChessRuleViolationType>[] | null {
    const { piece, position, promotionKind } = move;

    const isPawn = piece instanceof ChessPiecePawn;
    const canPromote = isPawn && piece.canPromote(position, moveContext.board);

    // Case 1: pawn reaches last rank but no promotion specified
    if (canPromote && !promotionKind) {
      return [{ reason: CHESS_RULE_VIOLATION_TYPES.INVALID_PROMOTION_MISSING_PROMOTION }];
    }

    // Case 2: promotion specified but move is not a pawn promotion
    if (promotionKind && !canPromote) {
      return [{ reason: CHESS_RULE_VIOLATION_TYPES.INVALID_PROMOTION }];
    }

    // Case 3: promotion kind is invalid
    if (promotionKind && !ALLOWED_PROMOTIONS.has(promotionKind)) {
      return [{ reason: CHESS_RULE_VIOLATION_TYPES.INVALID_PROMOTION_REQUESTED_PIECE_NOT_ALLOWED }];
    }

    return null;
  }
}
