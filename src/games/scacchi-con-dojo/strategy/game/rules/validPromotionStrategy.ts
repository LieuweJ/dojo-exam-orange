import { RULES_VIOLATIONS, RuleStrategy } from '../../../../../core/model/rules';
import { ProposedChessMove } from '../../../model/move';
import { ChessPiecePawn } from '../../../model/chessPiecePawn';
import { CHESS_PIECE_KIND, ChessPieceKind } from '../../../config/chessPiecesConfig';

const ALLOWED_PROMOTIONS: ReadonlySet<ChessPieceKind> = new Set([
  CHESS_PIECE_KIND.QUEEN,
  CHESS_PIECE_KIND.ROOK,
  CHESS_PIECE_KIND.BISHOP,
  CHESS_PIECE_KIND.KNIGHT,
]);

export class ValidPromotionStrategy implements RuleStrategy {
  check({ move, moveContext }: ProposedChessMove) {
    const { piece, position, promotionKind } = move;

    const isPawn = piece instanceof ChessPiecePawn;
    const canPromote = isPawn && piece.canPromote(position, moveContext.board);

    // Case 1: pawn reaches last rank but no promotion specified
    if (canPromote && !promotionKind) {
      return [RULES_VIOLATIONS.INVALID_PLACEMENT];
    }

    // Case 2: promotion specified but move is not a pawn promotion
    if (promotionKind && !canPromote) {
      return [RULES_VIOLATIONS.INVALID_PLACEMENT];
    }

    // Case 3: promotion kind is invalid
    if (promotionKind && !ALLOWED_PROMOTIONS.has(promotionKind)) {
      return [RULES_VIOLATIONS.INVALID_PLACEMENT];
    }

    return null;
  }
}
