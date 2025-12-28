import { IPiece } from '../../../core/model/IPiece';
import { BoardCell, BoardPosition, EMPTY_CELL, IBoardState } from '../../../core/model/boardState';
import { ChessPieceKind } from '../config/chessPiecesFactory';

export type IChessPiece = IPiece & {
  canReachPosition: (position: BoardPosition, boardState: IBoardState) => boolean;
  isCastlingDestination: (position: BoardPosition, boardState: IBoardState) => boolean;
  getAttackablePieces: () => Set<IPiece>;
  hasMoved: () => boolean;
  markMoved: () => void;
};

export type Direction = { row: number; column: number };

export type RelativeMovement = {
  direction: [Direction];
  maxSteps: number;
};

export class ChessPiece implements IChessPiece {
  private hasMovedFlag = false;
  protected readonly relativeMovement: Set<RelativeMovement>;

  constructor(
    private readonly boardValue: symbol,
    private readonly kind: ChessPieceKind,
    relativeMovement: ReadonlySet<RelativeMovement>,
    protected readonly attackablePieces: Set<IPiece>,
    private readonly canInitiateCastlingFlag = false,
    private readonly canParticipateInCastlingFlag = false
  ) {
    this.relativeMovement = new Set(relativeMovement);
  }

  getKind(): ChessPieceKind {
    return this.kind;
  }

  canInitiateCastling(): boolean {
    return this.canInitiateCastlingFlag;
  }

  canParticipateInCastling(): boolean {
    return this.canParticipateInCastlingFlag;
  }

  getBoardValue(): symbol {
    return this.boardValue;
  }

  hasMoved(): boolean {
    return this.hasMovedFlag;
  }

  markMoved(): void {
    this.hasMovedFlag = true;
  }

  canReachPosition(position: BoardPosition, boardState: IBoardState): boolean {
    if (this.canReachNormally(position, boardState)) {
      return true;
    }

    return this.canReachByCastling(position, boardState);
  }

  getAttackablePieces(): Set<IPiece> {
    return this.attackablePieces;
  }

  isCastlingDestination(position: BoardPosition, boardState: IBoardState): boolean {
    const from = boardState.getPiecePositionBy(this);

    if (!from) {
      return false;
    }

    if (position.row !== from.row) {
      return false;
    }

    const columnDelta = position.column - from.column;
    return Math.abs(columnDelta) === 2;
  }

  protected canReachNormally(position: BoardPosition, boardState: IBoardState): boolean {
    const from = boardState.getPiecePositionBy(this);

    if (!from) {
      return false;
    }

    for (const movement of this.relativeMovement) {
      for (const dir of movement.direction) {
        let currentRow = from.row;
        let currentColumn = from.column;

        for (let step = 1; step <= movement.maxSteps; step++) {
          currentRow += dir.row;
          currentColumn += dir.column;

          const currentPosition = { row: currentRow, column: currentColumn };

          // Off board → ray ends
          if (!this.isInsideBoard(currentPosition, boardState)) {
            break;
          }

          const cell = boardState.getBoardCellAt(currentPosition);

          // Target square reached
          if (currentRow === position.row && currentColumn === position.column) {
            return this.isReachableTarget(cell);
          }

          // Blocking piece before target → ray stops
          if (cell !== EMPTY_CELL) {
            break;
          }
        }
      }
    }

    return false;
  }

  protected isReachableTarget(cell: BoardCell): boolean {
    if (cell === EMPTY_CELL) {
      return true;
    }

    return this.attackablePieces.has(cell as IPiece);
  }

  private isInsideBoard(position: BoardPosition, boardState: IBoardState): boolean {
    const board = boardState.getBoard();
    return (
      position.row >= 0 &&
      position.row < board.length &&
      position.column >= 0 &&
      position.column < board[0].length
    );
  }

  private canReachByCastling(position: BoardPosition, boardState: IBoardState): boolean {
    if (!this.canAttemptCastling()) {
      return false;
    }

    const from = boardState.getPiecePositionBy(this);

    if (!from) {
      return false;
    }

    if (!this.isCastlingDestination(position, boardState)) {
      return false;
    }

    const rook = this.getCastlingRook(from, position, boardState);
    if (!this.isValidCastlingRook(rook)) {
      return false;
    }

    return this.isPathClearBetweenKingAndRook(from, position, boardState);
  }

  private canAttemptCastling(): boolean {
    return this.canInitiateCastling() && !this.hasMoved();
  }

  private getCastlingRook(
    from: BoardPosition,
    position: BoardPosition,
    boardState: IBoardState
  ): BoardCell {
    const direction = position.column > from.column ? 1 : -1;
    const rookColumn = direction > 0 ? boardState.getBoard()[from.row].length - 1 : 0;

    return boardState.getBoardCellAt({
      row: from.row,
      column: rookColumn,
    });
  }

  private isValidCastlingRook(rookCell: BoardCell): boolean {
    return (
      rookCell instanceof ChessPiece && rookCell.canParticipateInCastling() && !rookCell.hasMoved()
    );
  }

  private isPathClearBetweenKingAndRook(
    from: BoardPosition,
    position: BoardPosition,
    boardState: IBoardState
  ): boolean {
    const direction = position.column > from.column ? 1 : -1;
    const rookColumn = direction > 0 ? boardState.getBoard()[from.row].length - 1 : 0;

    for (let column = from.column + direction; column !== rookColumn; column += direction) {
      if (boardState.getBoardCellAt({ row: from.row, column }) !== EMPTY_CELL) {
        return false;
      }
    }

    return true;
  }
}
