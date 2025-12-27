import { Move } from '../model/rules';
import { BoardState } from '../model/boardState';

export type IMoveHandler = {
  handle(move: Move, boardState: BoardState): Promise<void>;
};
