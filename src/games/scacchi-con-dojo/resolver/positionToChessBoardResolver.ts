import { IBoardPositionUiResolver } from '../../../core/presenter/boardPresenter';
import { BoardPosition } from '../../../core/model/boardState';
import { ChessRowToString } from '../composition/chessComposition';

export class PositionToChessBoardResolver implements IBoardPositionUiResolver<string> {
  constructor(private rowToString: ChessRowToString) {}

  resolve(position: BoardPosition): string {
    const rowChar = this.rowToString[position.row];
    const column = position.column + 1;

    return `${rowChar}${column}`;
  }
}
