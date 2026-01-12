import { BoardPosition, IBoardState } from '../../../core/model/boardState';
import { IPiece } from '../../../core/model/IPiece';
import { ChessPiece, IChessPiece } from '../model/chessPiece';
import { ChessMove } from '../handler/ChessMoveHandler';
import { IPlayer, Pieces } from '../../../core/model/player';

export type BoardSimulationSnapshot = {
  board: IBoardState;
  players: IPlayer[];
};

export type MoveSimulationSnapshot<TPiece extends IPiece> = BoardSimulationSnapshot & {
  move: { piece: TPiece; position: BoardPosition };
};

export interface ISimulationFactory<TPiece extends IPiece> {
  createForBoard(board: IBoardState, players: IPlayer[]): BoardSimulationSnapshot;

  createForMove(
    board: IBoardState,
    players: IPlayer[],
    move: { piece: TPiece; position: BoardPosition }
  ): MoveSimulationSnapshot<TPiece>;
}

export class ChessSimulationFactory implements ISimulationFactory<IChessPiece> {
  createForBoard(board: IBoardState, players: IPlayer[]): BoardSimulationSnapshot {
    const { clonedBoard, clonedPlayers } = this.cloneBoardWithPlayers(board, players);

    return {
      board: clonedBoard,
      players: clonedPlayers,
    };
  }

  createForMove(
    board: IBoardState,
    players: IPlayer[],
    move: ChessMove
  ): MoveSimulationSnapshot<ChessPiece> {
    const { clonedBoard, clonedPlayers, clonedPieces } = this.cloneBoardWithPlayers(board, players);

    const clonedMovePiece = clonedPieces.get(move.piece);

    if (!(clonedMovePiece instanceof ChessPiece)) {
      throw new Error('Move piece not found in cloned board.');
    }

    return {
      board: clonedBoard,
      players: clonedPlayers,
      move: {
        piece: clonedMovePiece,
        position: move.position,
      },
    };
  }

  private cloneBoardWithPlayers(
    board: IBoardState,
    players: IPlayer[]
  ): {
    clonedBoard: IBoardState;
    clonedPlayers: IPlayer[];
    clonedPieces: Map<IPiece, IPiece>;
  } {
    const { clonedBoard, clonedPieces } = board.clone();

    const clonedPlayers: IPlayer[] = [];

    for (const player of players) {
      const originalPieces = player.getPieces();
      const remappedPieces: IPiece[] = [];

      for (const originalPiece of originalPieces) {
        let clonedPiece = clonedPieces.get(originalPiece);

        if (clonedPiece === undefined) {
          clonedPiece = originalPiece.clone();
          clonedPieces.set(originalPiece, clonedPiece);
        }

        remappedPieces.push(clonedPiece);
      }

      const nonEmptyPieces: Pieces = [remappedPieces[0], ...remappedPieces.slice(1)];

      clonedPlayers.push(player.cloneWithPieces(nonEmptyPieces));
    }

    return {
      clonedBoard,
      clonedPlayers,
      clonedPieces,
    };
  }
}
