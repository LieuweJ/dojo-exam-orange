import { BoardPosition, IBoardState } from '../model/boardState';
import { IPiece } from '../model/IPiece';
import { IPlayer } from '../model/player';

export type IMoveHandler<T extends IPiece> = {
  handle(
    move: { position: BoardPosition; piece: T },
    boardState: IBoardState,
    currentPlayer: IPlayer
  ): void;
};
