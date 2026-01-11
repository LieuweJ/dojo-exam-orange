import { BoardPosition, IBoard } from '../model/boardState';
import { IPlayer } from '../model/player';

export type BoardPresentArgs = {
  board: IBoard;
  highlightPositions?: BoardPosition[];
  players: IPlayer[];
};

export type IBoardPositionUiResolver<T> = {
  resolve(position: BoardPosition): T;
};

export type IOutputPresenter<T> = {
  present(arg: T): void;
};
