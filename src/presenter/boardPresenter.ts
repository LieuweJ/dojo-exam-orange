import { IOutputAdapter } from '../adapters/terminalOutputAdapter';
import { BoardCell, EMPTY_CELL, IBoard, MARKER_O, MARKER_X } from '../model/boardState';
import { BoardPosition } from '../strategy/game/gameOutcomeStrategy';

export const BOARD_CELL_TO_UI = new Map<BoardCell, string>([
  [EMPTY_CELL, '·'],
  [MARKER_X, '●'],
  [MARKER_O, '○'],
]);

export type BoardPresentArgs = {
  board: IBoard;
  highlightPositions?: BoardPosition[];
};

export type IOutputPresenter<T> = {
  present(arg: T): void;
};

export class BoardPresenter implements IOutputPresenter<BoardPresentArgs> {
  constructor(private outputAdapter: IOutputAdapter) {}

  public present({ board, highlightPositions = [] }: BoardPresentArgs): void {
    const highlightSet = this.toHighlightSet(highlightPositions);
    const columnCount = board[0].length;

    const output =
      this.renderBoardRows(board, highlightSet) +
      this.renderSeparatorLine(columnCount) +
      this.renderBottomNumbers(columnCount);

    this.outputAdapter.render(output);
  }

  private renderBoardRows(board: IBoard, highlightSet: Set<string>): string {
    let output = '';

    board.forEach((row, rowIndex) => {
      output += '|';
      row.forEach((cell, colIndex) => {
        output += this.renderCell(cell, { row: rowIndex, col: colIndex }, highlightSet);
      });
      output += '\n';
    });

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

  private renderCell(
    cell: BoardCell,
    boardPosition: BoardPosition,
    highlightSet: Set<string>
  ): string {
    const symbol = BOARD_CELL_TO_UI.get(cell)!;

    if (highlightSet.has(this.createCellKey(boardPosition))) {
      return `[${symbol}]|`;
    }

    return ` ${symbol} |`;
  }

  private toHighlightSet(positions: BoardPosition[]): Set<string> {
    return new Set(positions.map((boardPosition) => `${this.createCellKey(boardPosition)}`));
  }

  private createCellKey(boardPosition: BoardPosition): string {
    return `${boardPosition.row},${boardPosition.col}`;
  }
}
