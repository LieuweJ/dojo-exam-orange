import { BoardPosition } from '../model/boardState';

export type IBoardPositionResolver<T> = {
  resolve(input: T): BoardPosition;
};
