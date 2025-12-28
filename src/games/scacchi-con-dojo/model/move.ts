import { ProposedMove } from '../../../core/model/rules';
import { ChessPiece } from './chessPiece';
import { ChessPieceKind } from '../config/chessPiecesConfig';

export type ProposedChessMove = ProposedMove & {
  move: {
    piece: ChessPiece;
    promotionKind?: ChessPieceKind;
  };
};
