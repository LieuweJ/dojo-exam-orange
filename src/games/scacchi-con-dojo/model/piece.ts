import { IPiece } from '../../../core/model/IPiece';
import { BoardCell, BoardPosition, EMPTY_CELL, IBoardState } from '../../../core/model/boardState';

export type IChessPiece = IPiece & {
  canReachPosition: (position: BoardPosition, boardState: IBoardState) => boolean;
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

  constructor(
    private readonly boardValue: symbol,
    private readonly relativeMovement: Set<RelativeMovement>,
    protected readonly attackablePieces: Set<IPiece>
  ) {}

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
}
