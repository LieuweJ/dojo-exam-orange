import { ProposedMove } from '../../../core/model/rules';
import { IChessPiece } from './chessPiece';
import { ChessPieceKind } from '../config/chessPiecesConfig';

export type ProposedChessMove = ProposedMove & {
  move: {
    piece: IChessPiece;
    promotionKind?: ChessPieceKind;
  };
};
