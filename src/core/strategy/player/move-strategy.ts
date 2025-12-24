import { IBoard } from '../../model/boardState';
import { Move } from '../../model/rules';
import { Pieces } from '../../model/player';

export type IMoveStrategy = {
  createNextMove(board: IBoard, pieces: Pieces, displayName: string): Promise<Move>;
};
