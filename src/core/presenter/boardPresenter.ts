import { BoardPosition, IBoard } from '../model/boardState';

export type BoardPresentArgs = {
  board: IBoard;
  highlightPositions?: BoardPosition[];
};

export type IBoardPositionUiResolver<T> = {
  resolve(position: BoardPosition): T;
};

export type IOutputPresenter<T> = {
  present(arg: T): void;
};
