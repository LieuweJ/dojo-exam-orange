import { IMoveHandler } from '../../../core/handler/MoveHandler';
import { Move } from '../../../core/model/rules';
import { IBoardState } from '../../../core/model/boardState';

export class ChessMoveHandler implements IMoveHandler {
  async handle(move: Move, boardState: IBoardState): Promise<void> {
    const currentPosition = boardState.getPositionBy(move.piece);

    if (currentPosition) {
      boardState.clearPosition(currentPosition);
    }

    boardState.addMove(move);
  }
}
