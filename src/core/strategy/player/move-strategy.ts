import { IBoard } from '../../model/boardState';
import { Move } from '../../model/rules';
import { IPlayer } from '../../model/player';

export type IMoveStrategy = {
  createNextMove(board: IBoard, currentPlayer: IPlayer): Promise<Move>;
};
