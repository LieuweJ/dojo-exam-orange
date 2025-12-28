import { IMoveHandler } from '../../../core/handler/MoveHandler';
import { BoardPosition, BoardState } from '../../../core/model/boardState';
import { ChessPiece } from '../model/chessPiece';

export type ChessMove = {
  position: BoardPosition;
  piece: ChessPiece;
};

export class ChessMoveHandler implements IMoveHandler<ChessPiece> {
  async handle(move: ChessMove, boardState: BoardState): Promise<void> {
    const from = boardState.getPiecePositionBy(move.piece);

    if (!from) {
      throw new Error(
        `The chess piece ${String(move.piece.getBoardValue())} is not present on the board. Chess piece cannot be moved.`
      );
    }

    if (this.isCastlingMove(move, boardState)) {
      this.handleCastling(move, from, boardState);
      return;
    }

    this.handleNormalMove(move, from, boardState);
  }

  private isCastlingMove({ piece, position }: ChessMove, boardState: BoardState): boolean {
    return piece.canInitiateCastling() && piece.isCastlingDestination(position, boardState);
  }

  private handleNormalMove(move: ChessMove, from: BoardPosition, boardState: BoardState): void {
    boardState.clearPosition(from);
    boardState.addMove(move);
    move.piece.markMoved();
  }

  private handleCastling(move: ChessMove, from: BoardPosition, boardState: BoardState): void {
    const { piece: king, position: kingTarget } = move;

    // Determine direction
    const direction = kingTarget.column > from.column ? 1 : -1;

    // Determine rook positions
    const rookFromColumn = direction > 0 ? boardState.getBoard()[from.row].length - 1 : 0;

    const rookToColumn = from.column + direction;

    const rookFrom: BoardPosition = {
      row: from.row,
      column: rookFromColumn,
    };

    const rookTo: BoardPosition = {
      row: from.row,
      column: rookToColumn,
    };

    const rook = boardState.getBoardCellAt(rookFrom);

    if (!(rook instanceof ChessPiece)) {
      throw new Error('Castling rook not found where expected.');
    }

    // Clear old positions
    boardState.clearPosition(from);
    boardState.clearPosition(rookFrom);

    // Place king and rook
    boardState.addMove({ piece: king, position: kingTarget });
    boardState.addMove({ piece: rook, position: rookTo });

    // Mark both as moved
    king.markMoved();
    rook.markMoved();
  }
}
