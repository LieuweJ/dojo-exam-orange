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
import { CapturedPiecesProvider } from '../provider/CapturedPiecesProvider';
import { Team } from '../../../core/model/team';

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
    private readonly rowToString: ChessRowToString,
    private readonly capturedPiecesProvider: CapturedPiecesProvider
  ) {}

  public present({ board, highlightPositions = [], players }: BoardPresentArgs): void {
    const highlightSet = this.toHighlightSet(highlightPositions);
    const columnCount = board[0].length;

    const boardLines: string[] = [
      ...this.renderSeparatorLine(columnCount, '-', SeparatorStyle.TOP),
      ...this.renderBoardRows(board, highlightSet),
      ...this.renderColumnReferences(columnCount),
    ];

    const capturedByTeam = this.capturedPiecesProvider.getCapturedPieces(players, board);

    const capturedBlackLines = this.renderCapturedColumn(
      14,
      capturedByTeam,
      [...capturedByTeam.keys()][0],
      boardLines.length
    );

    const capturedWhiteLines = this.renderCapturedColumn(
      14,
      capturedByTeam,
      [...capturedByTeam.keys()][1],
      boardLines.length
    );

    const combined: string[] = boardLines.map((boardLine, i) => {
      const left = capturedBlackLines[i];
      const right = capturedWhiteLines[i];
      return `${left}     ${boardLine}     ${right}`;
    });

    this.print(combined);
  }

  private renderBoardRows(board: IBoard, highlightSet: Set<string>): string[] {
    const lines: string[] = [];

    board.forEach((row, rowIndex) => {
      const rowUiNumber = row.length - rowIndex;
      let rowLine = ` ${rowUiNumber} |`;
      row.forEach((cell, colIndex) => {
        rowLine += this.renderCell(cell, { row: rowIndex, column: colIndex }, highlightSet);
      });
      lines.push(rowLine);

      const place = rowIndex === board.length - 1 ? SeparatorStyle.BOTTOM : SeparatorStyle.MIDDLE;
      lines.push(this.renderSeparatorLine(row.length, '-', place)[0]);
    });

    return lines;
  }

  private renderSeparatorLine(
    columnCount: number,
    horizontalCharacter: string,
    renderStyle: SeparatorStyle
  ): string[] {
    const h = horizontalCharacter;

    const corner = this.separatorFrame[renderStyle];

    let separator = `   ${corner.left}`;

    for (let col = 0; col < columnCount; col++) {
      separator += `${h}${h}${h}`;
      separator += col < columnCount - 1 ? corner.middle : corner.right;
    }

    return [separator];
  }

  private renderColumnReferences(columnCount: number): string[] {
    let bottomNumbers = '    ';

    for (let col = 0; col < columnCount; col++) {
      bottomNumbers += ` ${this.rowToString[col]}  `;
    }
    bottomNumbers += '\n';

    return [bottomNumbers];
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

  private renderCapturedColumn(
    width: number,
    captured: Map<Team, ChessPiece[]>,
    team: Team,
    height: number
  ): string[] {
    const pieces = captured.get(team) ?? [];

    const lines: string[] = [];

    let current = '';

    for (const piece of pieces) {
      const pieceUi = this.pieceUi.get(piece.getKind());
      const symbol = pieceUi?.get(piece.getTeam()) ?? '?';

      const next = current ? `${current} ${symbol}` : symbol;

      if (next.length > width) {
        lines.push(current.padEnd(width));
        current = symbol;
      } else {
        current = next;
      }
    }

    if (current) {
      lines.push(current.padEnd(width));
    }

    while (lines.length < height) {
      lines.push(' '.repeat(width));
    }

    return lines;
  }

  private print(lines: string[]): void {
    this.outputAdapter.render(lines.join('\n'));
  }
}
