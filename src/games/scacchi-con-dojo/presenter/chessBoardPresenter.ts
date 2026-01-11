import { IOutputAdapter } from '../../../core/adapters/terminalOutputAdapter';
import { BoardCell, BoardPosition, EMPTY_CELL, IBoard } from '../../../core/model/boardState';
import { BoardPresentArgs, IOutputPresenter } from '../../../core/presenter/boardPresenter';
import { ChessPiece } from '../model/chessPiece';
import { ChessPieceKind } from '../config/chessPiecesConfig';
import {
  BOARD_PARITY,
  BoardParity,
  ChessPieceUi,
  ChessRowToString,
} from '../composition/chessComposition';

enum SeparatorStyle {
  TOP = 'top',
  MIDDLE = 'middle',
  BOTTOM = 'bottom',
}

export class ChessBoardPresenter implements IOutputPresenter<BoardPresentArgs> {
  private readonly separatorFrame = {
    top: { left: '┌', middle: '┬', right: '┐' },
    middle: { left: '├', middle: '┼', right: '┤' },
    bottom: { left: '└', middle: '┴', right: '┘' },
  } as const;

  constructor(
    private readonly outputAdapter: IOutputAdapter,
    private readonly pieceUi: Map<ChessPieceKind, ChessPieceUi>,
    private readonly squareUi: Map<BoardParity, string>,
    private readonly rowToString: ChessRowToString
  ) {}

  public present({ board, highlightPositions = [] }: BoardPresentArgs): void {
    const highlightSet = this.toHighlightSet(highlightPositions);
    const columnCount = board[0].length;

    const output =
      this.renderSeparatorLine(columnCount, '-', SeparatorStyle.TOP) +
      this.renderBoardRows(board, highlightSet) +
      this.renderColumnReferences(columnCount);

    this.outputAdapter.render(output);
  }

  private renderBoardRows(board: IBoard, highlightSet: Set<string>): string {
    let output = '';

    board.forEach((row, rowIndex) => {
      const rowUiNumber = row.length - rowIndex;
      output += ` ${rowUiNumber} |`;
      row.forEach((cell, colIndex) => {
        output += this.renderCell(cell, { row: rowIndex, column: colIndex }, highlightSet);
      });

      const place = rowIndex === board.length - 1 ? SeparatorStyle.BOTTOM : SeparatorStyle.MIDDLE;
      output += `\n${this.renderSeparatorLine(row.length, '-', place)}`;
    });

    return output;
  }

  private renderSeparatorLine(
    columnCount: number,
    horizontalCharacter: string,
    renderStyle: SeparatorStyle
  ): string {
    const h = horizontalCharacter;

    const corner = this.separatorFrame[renderStyle];

    let separator = `   ${corner.left}`;

    for (let col = 0; col < columnCount; col++) {
      separator += `${h}${h}${h}`;
      separator += col < columnCount - 1 ? corner.middle : corner.right;
    }

    separator += `\n`;
    return separator;
  }

  private renderColumnReferences(columnCount: number): string {
    let bottomNumbers = '    ';

    for (let col = 0; col < columnCount; col++) {
      bottomNumbers += ` ${this.rowToString[col]}  `;
    }
    bottomNumbers += '\n';

    return bottomNumbers;
  }

  private renderCell(
    cell: BoardCell,
    boardPosition: BoardPosition,
    highlightSet: Set<string>
  ): string {
    const symbol = this.resolveCellUiSymbol(cell, boardPosition);

    if (this.isHighlightedCell(boardPosition, highlightSet)) {
      return `[${symbol}]|`;
    }

    return ` ${symbol} |`;
  }

  private resolveCellUiSymbol(cell: BoardCell, position: BoardPosition): string {
    if (cell === EMPTY_CELL) {
      return this.renderEmptyCell(position);
    }

    if (cell instanceof ChessPiece) {
      return this.renderChessPiece(cell);
    }

    throw new Error(`Unknown BoardCell at position ${JSON.stringify(position)}`);
  }

  private renderEmptyCell(position: BoardPosition): string {
    const parity: BoardParity =
      (position.row + position.column) % 2 === 0 ? BOARD_PARITY.EVEN : BOARD_PARITY.ODD;

    const symbol = this.squareUi.get(parity);
    if (!symbol) {
      throw new Error(`Missing square UI for parity: ${String(parity)}`);
    }

    return symbol;
  }

  private renderChessPiece(piece: ChessPiece): string {
    const pieceUi = this.pieceUi.get(piece.getKind());
    if (!pieceUi) {
      throw new Error(`Missing UI mapping for piece kind: ${piece.getKind()}`);
    }

    const symbol = pieceUi.get(piece.getTeam());
    if (!symbol) {
      throw new Error(`Missing UI symbol for team: ${String(piece.getTeam())}`);
    }

    return symbol;
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
