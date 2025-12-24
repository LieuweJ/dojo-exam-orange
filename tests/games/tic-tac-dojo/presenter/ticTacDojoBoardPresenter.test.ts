import { IOutputAdapter } from '../../../../src/core/adapters/terminalOutputAdapter';
import { Piece } from '../../../../src/core/model/player';
import {
  BoardCell,
  BoardPosition,
  EMPTY_CELL,
  IBoard,
} from '../../../../src/core/model/boardState';
import { TicTacDojoBoardPresenter } from '../../../../src/games/tic-tac-dojo/presenter/ticTacDojoBoardPresenter';

describe('TicTacDojoBoardPresenter', () => {
  let outputAdapter: jest.Mocked<IOutputAdapter>;

  const X: Piece = { boardValue: Symbol('X') };
  const O: Piece = { boardValue: Symbol('O') };

  const boardCellToUi = new Map<BoardCell, string>([
    [EMPTY_CELL, ' '],
    [X, 'X'],
    [O, 'O'],
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
    const UNKNOWN_CELL = { boardValue: Symbol('UNKNOWN') } as Piece;

    const board: IBoard = [[UNKNOWN_CELL]];

    const presenter = new TicTacDojoBoardPresenter(outputAdapter, boardCellToUi, ROW_TO_STRING);

    expect(() => presenter.present({ board })).toThrow(
      `Piece cannot be rendered at boardPosition: {"row":0,"column":0}.`
    );
  });
});
