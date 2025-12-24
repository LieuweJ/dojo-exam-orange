import { IBoardPositionUiResolver } from '../../../core/presenter/boardPresenter';
import { BoardPosition } from '../../../core/model/boardState';

export class PositionToOrangeInARowCliResolver implements IBoardPositionUiResolver<string> {
  resolve(position: BoardPosition): string {
    return `column ${position.column + 1}`;
  }
}
