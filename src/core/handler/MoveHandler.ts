import { BoardPosition, IBoardState } from '../model/boardState';
import { IPiece } from '../model/IPiece';

export type IMoveHandler<T extends IPiece> = {
  handle(move: { position: BoardPosition; piece: T }, boardState: IBoardState): void;
};
