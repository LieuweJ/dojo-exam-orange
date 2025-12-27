import { Piece } from '../../../core/model/player';

export const CHESS_PIECE_TYPES = {
  PAWN: 'pawn',
} as const;

type ChessPieceType = (typeof CHESS_PIECE_TYPES)[keyof typeof CHESS_PIECE_TYPES];

export class ChessPiece implements Piece {
  constructor(
    public readonly boardValue: symbol,
    private readonly type: ChessPieceType
  ) {}
}
