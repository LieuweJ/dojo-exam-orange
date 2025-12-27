import { ProposedMove } from '../../../core/model/rules';
import { ChessPiece } from './piece';

export type ProposedChessMove = ProposedMove & {
  move: {
    piece: ChessPiece;
  };
};
