import { IOutputAdapter } from '../../../core/adapters/terminalOutputAdapter';
import { BoardCell, BoardPosition, IBoard } from '../../../core/model/boardState';
import { BoardPresentArgs, IOutputPresenter } from '../../../core/presenter/boardPresenter';
import { TicTacDojoRowToString } from '../composition/ticTacDojoComposition';

export class TicTacDojoBoardPresenter implements IOutputPresenter<BoardPresentArgs> {
  constructor(
    private readonly outputAdapter: IOutputAdapter,
    private readonly boardCellToUi: Map<symbol, string>,
    private readonly rowToString: TicTacDojoRowToString
  ) {}

  public present({ board, highlightPositions = [] }: BoardPresentArgs): void {
    const highlightSet = this.toHighlightSet(highlightPositions);
    const columnCount = board[0].length;

    const output =
      this.renderSeparatorLine(columnCount, ' ') +
      this.renderSeparatorLine(columnCount, '-') +
      this.renderBoardRows(board, highlightSet) +
      this.renderBottomNumbers(columnCount);

    this.outputAdapter.render(output);
  }

  private renderBoardRows(board: IBoard, highlightSet: Set<string>): string {
    let output = '';

    board.forEach((row, rowIndex) => {
      output += ` ${this.rowToString[rowIndex]} |`;
      row.forEach((cell, colIndex) => {
        output += this.renderCell(cell, { row: rowIndex, column: colIndex }, highlightSet);
      });
      output += `\n${this.renderSeparatorLine(row.length, '-')}`;
    });

    return output;
  }

  private renderSeparatorLine(columnCount: number, horizontalCharacter: string): string {
    const h = horizontalCharacter;
    let separator = `${h + h + h}`;

    for (let col = 0; col < columnCount; col++) {
      separator += `|${h + h + h}`;
    }
    separator += `|${h + h + h}\n`;

    return separator;
  }

  private renderBottomNumbers(columnCount: number): string {
    let bottomNumbers = '   |';

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
    const symbol = this.boardCellToUi.get(cell.getBoardValue());

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
