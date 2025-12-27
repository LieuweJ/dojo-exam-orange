import { ChessPiece, Direction, RelativeMovement } from './chessPiece';
import { BoardCell, BoardPosition, EMPTY_CELL, IBoardState } from '../../../core/model/boardState';
import { IPiece } from '../../../core/model/IPiece';

export class ChessPiecePawn extends ChessPiece {
  private forwardMovement: RelativeMovement;
  private readonly attackDirections: Direction[];

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

    super(boardValue, new Set([forwardMovement]), attackablePieces);

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
    return this.canAttack(position, boardState);
  }

  markMoved(): void {
    super.markMoved();

    this.forwardMovement.maxSteps = 1;
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
