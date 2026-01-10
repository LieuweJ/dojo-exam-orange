import { IMoveHandler } from '../../../core/handler/MoveHandler';
import { BoardPosition, BoardState } from '../../../core/model/boardState';
import { ChessPiece } from '../model/chessPiece';
import { ChessPiecePawn } from '../model/chessPiecePawn';
import { ChessPieceKind } from '../config/chessPiecesConfig';
import { ChessPieceFactory } from '../factory/chessPieceFactory';

export type ChessMove = {
  position: BoardPosition;
  piece: ChessPiece;
  promotionKind?: ChessPieceKind;
};

export class ChessMoveHandler implements IMoveHandler<ChessPiece> {
  constructor(private pieceFactory: ChessPieceFactory) {}

  async handle(move: ChessMove, boardState: BoardState): Promise<void> {
    const from = boardState.getPiecePositionBy(move.piece);

    if (!from) {
      throw new Error(
        `The chess piece ${String(move.piece.getBoardValue())} is not present on the board. Chess piece cannot be moved.`
      );
    }

    if (this.isCastlingMove(move, boardState)) {
      this.handleCastling(move, from, boardState);
      this.clearAllEnPassant(boardState);

      return;
    }

    if (this.isEnPassantMove(move, boardState)) {
      this.handleEnPassant(move, from, boardState);
      this.clearAllEnPassant(boardState);

      return;
    }

    if (this.isPromotion(move, boardState)) {
      this.handlePromotion(move, from, boardState);
      this.clearAllEnPassant(boardState);
      return;
    }

    this.handleNormalMove(move, from, boardState);

    this.clearAllEnPassant(boardState);

    const pawnPosition = boardState.getPiecePositionBy(move.piece);

    if (
      move.piece instanceof ChessPiecePawn &&
      this.isPawnDoubleStep(move.piece, from, move.position) &&
      pawnPosition
    ) {
      this.registerEnPassantTargets(pawnPosition, move.position, boardState);
    }
  }

  private isCastlingMove({ piece, position }: ChessMove, boardState: BoardState): boolean {
    return piece.canInitiateCastling() && piece.isCastlingDestination(position, boardState);
  }

  private handleNormalMove(move: ChessMove, from: BoardPosition, boardState: BoardState): void {
    this.movePiece(move.piece, from, move.position, boardState);
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

    this.movePiece(king, from, kingTarget, boardState);
    this.movePiece(rook, rookFrom, rookTo, boardState);
  }

  private handlePromotion(move: ChessMove, from: BoardPosition, boardState: BoardState): void {
    const { piece, position, promotionKind } = move;

    if (!promotionKind) {
      throw new Error(
        `Promotion missing. Piece=${piece.constructor.name}, to=${position.row},${position.column}`
      );
    }

    const index = this.getNextIndexForKind(promotionKind, boardState);

    const promoted = this.pieceFactory.createFrom(piece, promotionKind, index);

    boardState.clearPosition(from);
    boardState.addMove({ piece: promoted, position });
    promoted.markMoved();
  }

  private getNextIndexForKind(kind: ChessPieceKind, boardState: BoardState): number {
    let maxIndex = 0;

    for (const row of boardState.getBoard()) {
      for (const cell of row) {
        if (cell instanceof ChessPiece && cell.getKind() === kind) {
          const match = cell.getBoardValue().description?.match(/\d+/);
          if (match) {
            maxIndex = Math.max(maxIndex, Number(match[0]));
          }
        }
      }
    }

    return maxIndex + 1;
  }

  private isPromotion(move: ChessMove, boardState: BoardState): boolean {
    return move.piece instanceof ChessPiecePawn && move.piece.canPromote(move.position, boardState);
  }

  private isEnPassantMove(move: ChessMove, boardState: BoardState): boolean {
    return (
      move.piece instanceof ChessPiecePawn &&
      move.piece.canEnPassantAttack(move.position, boardState)
    );
  }

  private handleEnPassant(move: ChessMove, from: BoardPosition, boardState: BoardState): void {
    const pawn = move.piece;

    const capturedPawnPosition: BoardPosition = {
      row: from.row,
      column: move.position.column,
    };

    // Remove captured pawn
    boardState.clearPosition(capturedPawnPosition);

    // Move attacking pawn
    this.movePiece(pawn, from, move.position, boardState);
  }

  private isPawnDoubleStep(pawn: ChessPiecePawn, from: BoardPosition, to: BoardPosition): boolean {
    return Math.abs(to.row - from.row) === 2;
  }

  private registerEnPassantTargets(
    pawnPosition: BoardPosition,
    to: BoardPosition,
    boardState: BoardState
  ): void {
    const targetRow = to.row; // IMPORTANT: enemy pawns are on the landing row
    const col = to.column;

    const adjacentColumns = [col - 1, col + 1];

    for (const adjCol of adjacentColumns) {
      const cell = boardState.getBoardCellAt({
        row: targetRow,
        column: adjCol,
      });

      if (cell instanceof ChessPiecePawn) {
        cell.addEnPassantTargetColumn(pawnPosition.column);
      }
    }
  }

  private clearAllEnPassant(boardState: BoardState): void {
    for (const row of boardState.getBoard()) {
      for (const cell of row) {
        if (cell instanceof ChessPiecePawn) {
          cell.clearEnPassantTargets();
        }
      }
    }
  }

  private movePiece(
    piece: ChessPiece,
    from: BoardPosition,
    to: BoardPosition,
    boardState: BoardState
  ): void {
    boardState.clearPosition(from);
    boardState.addMove({ piece, position: to });
    piece.markMoved();
  }
}
