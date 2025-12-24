import { IBoardPositionResolver } from '../../core/resolvers/MoveResolver';
import { BoardPosition, EMPTY_CELL, IBoard } from '../../core/model/boardState';

export type CliPositionResolverArgs = {
  column: number;
  board: IBoard;
};

export class CliColumnInputResolver implements IBoardPositionResolver<CliPositionResolverArgs> {
  resolve({ column, board }: CliPositionResolverArgs): BoardPosition {
    for (let row = board.length - 1; row >= 0; row--) {
      if (board[row][column] === EMPTY_CELL) {
        return {
          row,
          column,
        };
      }
    }

    throw new Error(`Invalid userInput. BoardPosition cannot be found.`);
  }
}
