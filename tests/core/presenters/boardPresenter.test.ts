import { BoardPresenter } from '../../../src/core/presenter/boardPresenter';
import { IOutputAdapter } from '../../../src/core/adapters/terminalOutputAdapter';
import { BoardCell, BoardPosition, EMPTY_CELL, IBoard } from '../../../src/core/model/boardState';
import {
  ORANGE_IN_A_ROW_BOARD_UI,
  PIECE_O,
  PIECE_X,
} from '../../../src/composition/orangeInARowComposition';

describe('BoardPresenter', () => {
  let outputAdapter: jest.Mocked<IOutputAdapter>;
  let presenter: BoardPresenter;

  beforeEach(() => {
    outputAdapter = {
      render: jest.fn(),
    };

    presenter = new BoardPresenter(outputAdapter, ORANGE_IN_A_ROW_BOARD_UI);
  });

  test('Board displays coins with correct colors for each player', () => {
    const board: IBoard = [
      [EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, PIECE_X],
      [PIECE_O, PIECE_X],
    ];

    presenter.present({ board });

    expect(outputAdapter.render).toHaveBeenCalledWith(
      `| · | · |\n| · | ● |\n| ○ | ● |\n|---|---|\n| 1 | 2 |\n`
    );
  });

  test('Board displays highlights', () => {
    const highlightPositions: BoardPosition[] = [
      { row: 0, column: 1 },
      { row: 2, column: 0 },
      { row: 2, column: 1 },
    ];

    const board: IBoard = [
      [PIECE_O, EMPTY_CELL],
      [EMPTY_CELL, PIECE_X],
      [PIECE_O, PIECE_X],
    ];

    presenter.present({ board, highlightPositions });

    expect(outputAdapter.render).toHaveBeenCalledWith(
      `| ○ |[·]|\n| · | ● |\n|[○]|[●]|\n|---|---|\n| 1 | 2 |\n`
    );
  });

  test('throws error when boardRepresenter does not know how to render a piece.', () => {
    const board: IBoard = [
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, PIECE_O, PIECE_X],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ];

    const uiMappingWithoutPieceX = new Map<BoardCell, string>([
      [EMPTY_CELL, '·'],
      [PIECE_O, '○'],
      // PIECE_X is intentionally missing
    ]);

    const boardPresenter = new BoardPresenter(outputAdapter, uiMappingWithoutPieceX);

    expect(() => boardPresenter.present({ board })).toThrow(
      `Piece cannot be rendered at boardPosition: {\"row\":1,\"column\":2}.`
    );
  });
});
