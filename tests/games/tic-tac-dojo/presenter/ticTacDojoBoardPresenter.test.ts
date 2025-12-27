import { IOutputAdapter } from '../../../../src/core/adapters/terminalOutputAdapter';
import { BoardPosition, EMPTY_CELL, IBoard } from '../../../../src/core/model/boardState';
import { TicTacDojoBoardPresenter } from '../../../../src/games/tic-tac-dojo/presenter/ticTacDojoBoardPresenter';
import { IPiece } from '../../../../src/core/model/IPiece';
import { CoinPiece } from '../../../../src/sharedMechanics/connectLineGame/model/coinPiece';

describe('TicTacDojoBoardPresenter', () => {
  let outputAdapter: jest.Mocked<IOutputAdapter>;

  const X: IPiece = new CoinPiece(Symbol('X'));
  const O: IPiece = new CoinPiece(Symbol('O'));

  const boardCellToUi = new Map<symbol, string>([
    [EMPTY_CELL.getBoardValue(), ' '],
    [X.getBoardValue(), 'X'],
    [O.getBoardValue(), 'O'],
  ]);

  const ROW_TO_STRING = {
    0: 'a',
    1: 'b',
    2: 'c',
  } as const;

  beforeEach(() => {
    outputAdapter = {
      render: jest.fn(),
    };
  });

  it('renders an empty 3x3 board', () => {
    const board: IBoard = [
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ];

    const presenter = new TicTacDojoBoardPresenter(outputAdapter, boardCellToUi, ROW_TO_STRING);

    presenter.present({ board });

    expect(outputAdapter.render).toHaveBeenCalledTimes(1);

    const output = outputAdapter.render.mock.calls[0][0];

    expect(output).toContain(' a |   |   |   |');
    expect(output).toContain(' b |   |   |   |');
    expect(output).toContain(' c |   |   |   |');
    expect(output).toContain('   | 1 | 2 | 3 |');
  });

  it('renders pieces on the board', () => {
    const board: IBoard = [
      [X, EMPTY_CELL, O],
      [EMPTY_CELL, X, EMPTY_CELL],
      [O, EMPTY_CELL, X],
    ];

    const presenter = new TicTacDojoBoardPresenter(outputAdapter, boardCellToUi, ROW_TO_STRING);

    presenter.present({ board });

    const output = outputAdapter.render.mock.calls[0][0];

    expect(output).toContain(' a | X |   | O |');
    expect(output).toContain(' b |   | X |   |');
    expect(output).toContain(' c | O |   | X |');
  });

  it('highlights specified positions', () => {
    const board: IBoard = [
      [X, EMPTY_CELL, O],
      [EMPTY_CELL, X, EMPTY_CELL],
      [O, EMPTY_CELL, X],
    ];

    const highlightPositions: BoardPosition[] = [
      { row: 0, column: 0 },
      { row: 2, column: 2 },
    ];

    const presenter = new TicTacDojoBoardPresenter(outputAdapter, boardCellToUi, ROW_TO_STRING);

    presenter.present({ board, highlightPositions });

    const output = outputAdapter.render.mock.calls[0][0];

    expect(output).toContain(' a |[X]|   | O |');
    expect(output).toContain(' c | O |   |[X]|');
  });

  it('throws if a board cell cannot be rendered', () => {
    const UNKNOWN_CELL: IPiece = new CoinPiece(Symbol('UNKNOWN'));

    const board: IBoard = [[UNKNOWN_CELL]];

    const presenter = new TicTacDojoBoardPresenter(outputAdapter, boardCellToUi, ROW_TO_STRING);

    expect(() => presenter.present({ board })).toThrow(
      `Piece cannot be rendered at boardPosition: {"row":0,"column":0}.`
    );
  });
});
