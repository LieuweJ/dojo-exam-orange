import { IPiece } from '../../../core/model/IPiece';
import { BoardCell, BoardPosition, EmptyCell, IBoardState } from '../../../core/model/boardState';
import { ChessPieceKind } from '../config/chessPiecesConfig';
import { Team } from '../../../core/model/team';

export type IChessPiece = IPiece & {
  canReachPosition: (position: BoardPosition, boardState: IBoardState) => boolean;
  isCastlingDestination: (position: BoardPosition, boardState: IBoardState) => boolean;
  hasMoved: () => boolean;
  markMoved: () => void;
  isTeam: (team: Team) => boolean;
  getTeam: () => Team;
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
    protected readonly team: Team,
    private readonly canInitiateCastlingFlag = false,
    private readonly canParticipateInCastlingFlag = false
  ) {
    this.relativeMovement = new Set(relativeMovement);
  }

  isTeam(team: Team): boolean {
    return this.team === team;
  }

  getTeam(): Team {
    return this.team;
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
          if (!(cell instanceof EmptyCell)) {
            break;
          }
        }
      }
    }

    return false;
  }

  protected isReachableTarget(cell: BoardCell): boolean {
    if (!(cell instanceof ChessPiece)) {
      return true;
    }

    return !cell.isTeam(this.team);
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
      const cell = boardState.getBoardCellAt({ row: from.row, column });
      if (!(cell instanceof EmptyCell)) {
        return false;
      }
    }

    return true;
  }
}
