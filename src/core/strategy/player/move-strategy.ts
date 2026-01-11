import { IBoard } from '../../model/boardState';
import { Move } from '../../model/rules';
import { IPlayer } from '../../model/player';

export type NextMoveInput = {
  context: {
    board: IBoard;
    players: IPlayer[];
  };
  currentPlayer: IPlayer;
};

export type IMoveStrategy = {
  createNextMove(args: NextMoveInput): Promise<Move>;
};
