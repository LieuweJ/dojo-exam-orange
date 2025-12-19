import { BoardPresenter } from '../../src/presenter/boardPresenter';
import { IOutputAdapter } from '../../src/adapters/outputAdapter';
import { EMPTY_CELL, IBoard } from '../../src/model/board';

describe('BoardPresenter', () => {
  let outputAdapter: jest.Mocked<IOutputAdapter>;
  let presenter: BoardPresenter;

  beforeEach(() => {
    outputAdapter = {
      render: jest.fn(),
    };

    presenter = new BoardPresenter(outputAdapter);
  });

  test('renders a small empty board correctly', () => {
    const board: IBoard = [
      [EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL],
    ];

    presenter.present(board);

    expect(outputAdapter.render).toHaveBeenCalledWith(
      `|   |   |\n|   |   |\n|   |   |\n---------\n`
    );
  });
});
