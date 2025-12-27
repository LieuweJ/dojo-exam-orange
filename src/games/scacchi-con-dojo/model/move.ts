import { ProposedMove } from '../../../core/model/rules';
import { ChessPiece } from './chessPiece';

export type ProposedChessMove = ProposedMove & {
  move: {
    piece: ChessPiece;
  };
};
