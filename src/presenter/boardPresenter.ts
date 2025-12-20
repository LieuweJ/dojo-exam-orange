import { IOutputAdapter } from '../adapters/terminalOutputAdapter';
import { BoardCell, EMPTY_CELL, IBoard, MARKER_O, MARKER_X } from '../model/boardState';

const BOARD_CELL_TO_UI = new Map<BoardCell, string>([
  [EMPTY_CELL, '·'],
  [MARKER_X, '●'],
  [MARKER_O, '○'],
]);

export type IOutputPresenter<T> = {
  present(arg: T): void;
};

export class BoardPresenter implements IOutputPresenter<IBoard> {
  constructor(private outputAdapter: IOutputAdapter) {}

  public present(board: IBoard): void {
    const columnCount = board[0].length;

    const output =
      this.renderBoardRows(board) +
      this.renderSeparatorLine(columnCount) +
      this.renderBottomNumbers(columnCount);

    this.outputAdapter.render(output);
  }

  private renderBoardRows(board: IBoard): string {
    let output = '';

    for (const row of board) {
      output += '|';
      for (const cell of row) {
        output += ` ${BOARD_CELL_TO_UI.get(cell)} |`;
      }
      output += '\n';
    }

    return output;
  }

  private renderSeparatorLine(columnCount: number): string {
    let separator = '';

    for (let col = 0; col < columnCount; col++) {
      separator += '|---';
    }
    separator += '|\n';

    return separator;
  }

  private renderBottomNumbers(columnCount: number): string {
    let bottomNumbers = '|';

    for (let col = 1; col <= columnCount; col++) {
      bottomNumbers += ` ${col} |`;
    }
    bottomNumbers += '\n';

    return bottomNumbers;
  }
}