import { ProposedMove } from '../../../core/model/rules';
import { ChessPiece } from './chessPiece';
import { ChessPieceKind } from '../config/chessPiecesFactory';

export type ProposedChessMove = ProposedMove & {
  move: {
    piece: ChessPiece;
    promotionKind?: ChessPieceKind;
  };
};
