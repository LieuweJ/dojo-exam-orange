import { BoardPosition, IBoard } from '../../../core/model/boardState';
import { IBoardPositionResolver } from '../../../core/resolvers/MoveResolver';
import { TicTacDojoToRow } from '../composition/ticTacDojoComposition';

export type CliPositionResolverArgs = {
  userInput: string;
  board: IBoard;
};

export class CliTicTacToeInputResolver implements IBoardPositionResolver<CliPositionResolverArgs> {
  constructor(private readonly toRowMap: TicTacDojoToRow) {}

  resolve({ userInput, board }: CliPositionResolverArgs): BoardPosition {
    if (!userInput || userInput.length !== 2) {
      throw new Error(`Invalid userInput '${userInput}'. Expected format like 'a1'.`);
    }

    const [rowCharRaw, columnChar] = userInput.toLowerCase();
    const row = this.toRowMap[rowCharRaw];
    const column = Number(columnChar) - 1;

    if (row === undefined) {
      throw new Error(`Invalid row '${rowCharRaw}'.`);
    }

    if (Number.isNaN(column)) {
      throw new Error(`Invalid column '${columnChar}'.`);
    }

    if (row < 0 || row >= board.length || column < 0 || column >= board[row].length) {
      throw new Error(`Position '${userInput}' is outside the board boundaries.`);
    }

    return { row, column };
  }
}
