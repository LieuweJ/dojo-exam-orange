import { IMoveHandler } from '../../../core/handler/MoveHandler';
import { CoinPiece } from '../model/coinPiece';
import { BoardPosition, EMPTY_CELL, IBoard, IBoardState } from '../../../core/model/boardState';
import { Move } from '../../../core/model/rules';

export class ConnectLineMoveHandler implements IMoveHandler<CoinPiece> {
  async handle(
    move: { position: { row: number; column: number }; piece: CoinPiece },
    boardState: IBoardState
  ): Promise<void> {
    this.assertEmptyCell(move.position, boardState);

    boardState.updateBoard(this.adaptMoveToBoard(move, boardState.getBoard()));
  }

  private adaptMoveToBoard(move: Move, board: IBoard): IBoard {
    const {
      position: { row, column },
      piece,
    } = move;

    board[row][column] = piece;

    return board;
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
