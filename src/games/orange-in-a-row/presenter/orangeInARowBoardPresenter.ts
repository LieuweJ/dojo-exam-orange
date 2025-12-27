import { IOutputAdapter } from '../../../core/adapters/terminalOutputAdapter';
import { BoardCell, BoardPosition, IBoard } from '../../../core/model/boardState';
import { BoardPresentArgs, IOutputPresenter } from '../../../core/presenter/boardPresenter';

export class OrangeInARowBoardPresenter implements IOutputPresenter<BoardPresentArgs> {
  constructor(
    private readonly outputAdapter: IOutputAdapter,
    private readonly boardCellToUi: Map<symbol, string>
  ) {}

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
        output += this.renderCell(cell, { row: rowIndex, column: colIndex }, highlightSet);
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
    const cellSymbol: symbol = cell.getBoardValue();

    const symbol = this.boardCellToUi.get(cellSymbol);

    if (!symbol) {
      throw new Error(
        `Piece cannot be rendered at boardPosition: ${JSON.stringify(boardPosition)}.`
      );
    }

    if (this.isHighlightedCell(boardPosition, highlightSet)) {
      return `[${symbol}]|`;
    }

    return ` ${symbol} |`;
  }

  private isHighlightedCell(boardPosition: BoardPosition, highlightSet: Set<string>): boolean {
    return highlightSet.has(this.createCellKey(boardPosition));
  }

  private toHighlightSet(positions: BoardPosition[]): Set<string> {
    return new Set(positions.map((boardPosition) => `${this.createCellKey(boardPosition)}`));
  }

  private createCellKey(boardPosition: BoardPosition): string {
    return `${boardPosition.row},${boardPosition.column}`;
  }
}
