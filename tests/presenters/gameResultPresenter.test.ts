import { GameResultPresenter } from '../../src/presenter/gameResultPresenter';
import { BoardPresenter } from '../../src/presenter/boardPresenter';
import { IOutputAdapter } from '../../src/adapters/terminalOutputAdapter';
import { EMPTY_CELL, IBoard, MARKER_O, MARKER_X } from '../../src/model/boardState';
import { GAME_OUTCOME } from '../../src/strategy/game/gameOutcomeStrategy';

describe('GameResultPresenter', () => {
  let outputAdapter: jest.Mocked<IOutputAdapter>;
  let boardPresenter: jest.Mocked<BoardPresenter>;
  let presenter: GameResultPresenter;

  beforeEach(() => {
    outputAdapter = {
      render: jest.fn(),
    };

    boardPresenter = {
      present: jest.fn(),
    } as unknown as jest.Mocked<BoardPresenter>;

    presenter = new GameResultPresenter(boardPresenter, outputAdapter);
  });

  test('renders winning board with highlights and winner message', () => {
    const board: IBoard = [
      [MARKER_X, MARKER_X, MARKER_X],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ];

    presenter.present({
      board,
      players: {
        [MARKER_X]: { getScreenName: () => 'Alice' } as any,
        [MARKER_O]: { getScreenName: () => 'Bob' } as any,
      },
      outcome: {
        type: GAME_OUTCOME.WIN,
        winner: MARKER_X,
        winningPositions: [
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 0, col: 2 },
        ],
      },
    });

    expect(boardPresenter.present).toHaveBeenCalledWith({
      board,
      highlightPositions: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ],
    });

    expect(outputAdapter.render).toHaveBeenCalledWith(
      'Alice (●) wins!'
    );
  });

  test('renders final board and draw message', () => {
    const board: IBoard = [
      [MARKER_X, MARKER_O],
      [MARKER_O, MARKER_X],
    ];

    presenter.present({
      board,
      players: {
        [MARKER_X]: { getScreenName: () => 'Alice' } as any,
        [MARKER_O]: { getScreenName: () => 'Bob' } as any,
      },
      outcome: {
        type: GAME_OUTCOME.DRAW,
      },
    });

    expect(boardPresenter.present).toHaveBeenCalledWith({
      board,
    });

    expect(outputAdapter.render).toHaveBeenCalledWith(
      "It's a draw."
    );
  });
});
