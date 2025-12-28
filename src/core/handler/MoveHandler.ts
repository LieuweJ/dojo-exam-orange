import { BoardPosition, BoardState } from '../model/boardState';
import { IPiece } from '../model/IPiece';

export type IMoveHandler<T extends IPiece> = {
  handle(move: { position: BoardPosition; piece: T }, boardState: BoardState): Promise<void>;
};
