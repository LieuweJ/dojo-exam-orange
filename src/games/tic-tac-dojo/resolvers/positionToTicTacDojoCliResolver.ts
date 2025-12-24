import { BoardPosition } from '../../../core/model/boardState';
import { IBoardPositionUiResolver } from '../../../core/presenter/boardPresenter';
import { TicTacDojoRowToString } from '../composition/ticTacDojoComposition';

export class PositionToTicTacToeCliResolver implements IBoardPositionUiResolver<string> {
  constructor(private rowToString: TicTacDojoRowToString) {}

  resolve(position: BoardPosition): string {
    const rowChar = this.rowToString[position.row];
    const column = position.column + 1;

    return `${rowChar}${column}`;
  }
}
