import { IPiece } from '../../../core/model/IPiece';
import { BoardPosition, EMPTY_CELL, IBoardState } from '../../../core/model/boardState';

export type IChessPiece = IPiece & {
  canReachPosition: (position: BoardPosition, boardState: IBoardState) => boolean;
};

export type Direction = { row: number; column: number };

export type RelativeMovement = {
  direction: [Direction];
  maxSteps: number;
};

export class ChessPiece implements IChessPiece {
  constructor(
    private readonly boardValue: symbol,
    private readonly relativeMovement: Set<RelativeMovement>,
    private readonly attackablePieces: Set<IPiece>
  ) {}

  getBoardValue(): symbol {
    return this.boardValue;
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
            // Empty square → reachable
            if (cell === EMPTY_CELL) {
              return true;
            }

            // Occupied square → only reachable if attackable
            return this.attackablePieces.has(cell as IPiece);
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
