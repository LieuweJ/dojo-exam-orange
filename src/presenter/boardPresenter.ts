import { IOutputAdapter } from '../adapters/outputAdapter';
import { BoardCell, EMPTY_CELL, IBoard, MARKER_O, MARKER_X } from '../model/board';

const BOARD_CELL_TO_UI = new Map<BoardCell, string>([
  [EMPTY_CELL, '⚪'],
  [MARKER_X, '🔴'],
  [MARKER_O, '🟡'],
]);

export type IPresenter<T> = {
  present(arg: T): void;
};

export class BoardPresenter implements IPresenter<IBoard> {
  constructor(private outputAdapter: IOutputAdapter) {}

  public present(board: IBoard): void {
    let output = '';
    let bottom = '';
    for (const row of board) {
      output += '|';
      for (const cell of row) {
        output += ` ${BOARD_CELL_TO_UI.get(cell)} |`;
      }
      output += '\n';
      bottom += '---';
    }
    output += bottom + '\n';

    this.outputAdapter.render(output);
  }
}