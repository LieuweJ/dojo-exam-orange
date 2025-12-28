import { ChessPiece, Direction, RelativeMovement } from './chessPiece';
import { BoardCell, BoardPosition, EMPTY_CELL, IBoardState } from '../../../core/model/boardState';
import { IPiece } from '../../../core/model/IPiece';
import { CHESS_PIECE_KIND } from '../config/chessPiecesFactory';

export class ChessPiecePawn extends ChessPiece {
  private forwardMovement: RelativeMovement;
  private readonly attackDirections: Direction[];
  private readonly enPassantAttackablePawns = new Set<ChessPiecePawn>();

  constructor(
    boardValue: symbol,
    forwardDirection: {
      row: number;
      column: number;
    },
    attackablePieces: Set<IPiece>
  ) {
    const forwardMovement: RelativeMovement = {
      direction: [forwardDirection],
      maxSteps: 2,
    };

    super(boardValue, CHESS_PIECE_KIND.PAWN, new Set([forwardMovement]), attackablePieces);

    this.forwardMovement = forwardMovement;
    this.attackDirections = [
      { row: forwardDirection.row, column: -1 },
      { row: forwardDirection.row, column: 1 },
    ];
  }

  canReachPosition(position: BoardPosition, boardState: IBoardState): boolean {
    // Forward movement (reuse base ray logic)
    if (super.canReachPosition(position, boardState)) {
      return true;
    }

    // Diagonal attack
    if (this.canAttack(position, boardState)) {
      return true;
    }

    // En Passant attack
    return this.canEnPassantAttack(position, boardState);
  }

  markMoved(): void {
    super.markMoved();

    this.forwardMovement.maxSteps = 1;
  }

  canPromote(position: BoardPosition, boardState: IBoardState): boolean {
    const from = boardState.getPiecePositionBy(this);
    if (!from) {
      return false;
    }

    const board = boardState.getBoard();
    const lastRow = this.attackDirections[0].row === -1 ? 0 : board.length - 1;

    return position.row === lastRow;
  }

  getForwardDirection(): Direction {
    return this.forwardMovement.direction[0];
  }

  setEnPassantAttackablePawn(pawn: ChessPiecePawn): void {
    this.enPassantAttackablePawns.add(pawn);
  }

  clearEnPassantAttackablePawns(): void {
    this.enPassantAttackablePawns.clear();
  }

  canEnPassantAttack(position: BoardPosition, boardState: IBoardState): boolean {
    const from = boardState.getPiecePositionBy(this);
    if (!from) return false;

    // determine forward direction from pawn movement
    const forwardRow = this.attackDirections[0].row;

    for (const targetPawn of this.enPassantAttackablePawns) {
      const targetPos = boardState.getPiecePositionBy(targetPawn);

      if (!targetPos) {
        continue;
      }

      const landingSquare: BoardPosition = {
        row: from.row + forwardRow,
        column: targetPos.column,
      };

      if (
        landingSquare.row === position.row &&
        landingSquare.column === position.column &&
        boardState.getBoardCellAt(landingSquare) === EMPTY_CELL
      ) {
        return true;
      }
    }

    return false;
  }

  protected isReachableTarget(cell: BoardCell): boolean {
    return cell === EMPTY_CELL;
  }

  private canAttack(position: BoardPosition, boardState: IBoardState): boolean {
    const from = boardState.getPiecePositionBy(this);
    if (!from) {
      return false;
    }

    for (const dir of this.attackDirections) {
      const target: BoardPosition = {
        row: from.row + dir.row,
        column: from.column + dir.column,
      };

      if (target.row === position.row && target.column === position.column) {
        const cell = boardState.getBoardCellAt(target);

        return this.attackablePieces.has(cell);
      }
    }

    return false;
  }
}
