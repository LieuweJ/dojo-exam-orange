import { BoardPresenter } from '../../src/presenter/boardPresenter';
import { IOutputAdapter } from '../../src/adapters/terminalOutputAdapter';
import { EMPTY_CELL, IBoard, MARKER_O, MARKER_X } from '../../src/model/boardState';

describe('BoardPresenter', () => {
  let outputAdapter: jest.Mocked<IOutputAdapter>;
  let presenter: BoardPresenter;

  beforeEach(() => {
    outputAdapter = {
      render: jest.fn(),
    };

    presenter = new BoardPresenter(outputAdapter);
  });

  test('Board displays coins with correct colors for each player', () => {
    const board: IBoard = [
      [EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, MARKER_X],
      [MARKER_O, MARKER_X],
    ];

    presenter.present({ board });

    expect(outputAdapter.render).toHaveBeenCalledWith(
      `| · | · |\n| · | ● |\n| ○ | ● |\n|---|---|\n| 1 | 2 |\n`
    );
  });

  test('Board displays highlights', () => {
    const highlightPositions = [
      {row: 0, col: 1},
      { row: 2, col: 0 },
      { row: 2, col: 1 }
    ];

    const board: IBoard = [
      [MARKER_O, EMPTY_CELL],
      [EMPTY_CELL, MARKER_X],
      [MARKER_O, MARKER_X],
    ];

    presenter.present({ board, highlightPositions});

    expect(outputAdapter.render).toHaveBeenCalledWith(
      `| ○ |[·]|\n| · | ● |\n|[○]|[●]|\n|---|---|\n| 1 | 2 |\n`
    );
  });
});
