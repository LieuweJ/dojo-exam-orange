import { IBoard } from '../../model/boardState';
import { Move } from '../../model/rules';
import { IPlayer } from '../../model/player';

export type CreateNextMoveInput = {
  context: {
    board: IBoard;
    players: IPlayer[];
  };
  currentPlayer: IPlayer;
};

export type IMoveStrategy = {
  createNextMove(args: CreateNextMoveInput): Promise<Move>;
};
