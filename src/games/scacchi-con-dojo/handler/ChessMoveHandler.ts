import { IMoveHandler } from '../../../core/handler/MoveHandler';
import { Move } from '../../../core/model/rules';
import { IBoardState } from '../../../core/model/boardState';

export class ChessMoveHandler implements IMoveHandler {
  async handle(move: Move, boardState: IBoardState): Promise<void> {
    const currentPosition = boardState.getPiecePositionBy(move.piece);

    if (!currentPosition) {
      throw new Error(
        `The chess piece ${String(move.piece.getBoardValue())} is not present on the board. Chess piece cannot be moved.`
      );
    }

    boardState.clearPosition(currentPosition);
    boardState.addMove(move);
  }
}
