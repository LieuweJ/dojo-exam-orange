import { BoardPosition, IBoardState } from '../../../core/model/boardState';
import { IPiece } from '../../../core/model/IPiece';
import { ChessPiece, IChessPiece } from '../model/chessPiece';
import { ChessMove } from '../handler/ChessMoveHandler';

export type BoardSimulationSnapshot = {
  board: IBoardState;
};

export type MoveSimulationSnapshot<TPiece extends IPiece> = BoardSimulationSnapshot & {
  move: { piece: TPiece; position: BoardPosition };
};

export interface ISimulationFactory<TPiece extends IPiece> {
  createForBoard(board: IBoardState): BoardSimulationSnapshot;

  createForMove(
    board: IBoardState,
    move: { piece: TPiece; position: BoardPosition }
  ): MoveSimulationSnapshot<TPiece>;
}

export class ChessSimulationFactory implements ISimulationFactory<IChessPiece> {
  createForBoard(board: IBoardState): BoardSimulationSnapshot {
    const { clonedBoard } = board.clone();

    return { board: clonedBoard };
  }

  createForMove(board: IBoardState, move: ChessMove): MoveSimulationSnapshot<ChessPiece> {
    const { clonedBoard, clonedPieces } = board.clone();
    const clonedMovePiece = clonedPieces.get(move.piece);

    if (!(clonedMovePiece instanceof ChessPiece)) {
      throw new Error('Move piece not found in cloned board.');
    }

    return {
      board: clonedBoard,
      move: {
        piece: clonedMovePiece,
        position: move.position,
      },
    };
  }
}
