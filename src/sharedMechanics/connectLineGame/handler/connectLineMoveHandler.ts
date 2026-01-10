import { IMoveHandler } from '../../../core/handler/MoveHandler';
import { CoinPiece } from '../model/coinPiece';
import { BoardPosition, EMPTY_CELL, IBoardState } from '../../../core/model/boardState';

export class ConnectLineMoveHandler implements IMoveHandler<CoinPiece> {
  async handle(
    move: { position: { row: number; column: number }; piece: CoinPiece },
    boardState: IBoardState
  ): Promise<void> {
    this.assertEmptyCell(move.position, boardState);

    boardState.addMove(move);
  }

  private assertEmptyCell(position: BoardPosition, boardState: IBoardState) {
    const currentDestination = boardState.getBoardCellAt(position);
    if (currentDestination !== EMPTY_CELL) {
      throw new Error(
        `Invalid move: board position with row: ${position.row} and ${position.column} is already occupied by ${String(currentDestination.getBoardValue())}.`
      );
    }
  }
}
