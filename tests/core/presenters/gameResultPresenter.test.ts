import { GameResultPresenter } from '../../../src/core/presenter/gameResultPresenter';
import { BoardPresentArgs, IOutputPresenter } from '../../../src/core/presenter/boardPresenter';
import { IOutputAdapter } from '../../../src/core/adapters/terminalOutputAdapter';
import { EMPTY_CELL, IBoard, MARKER_O, MARKER_X } from '../../../src/core/model/boardState';
import { GAME_OUTCOME } from '../../../src/core/strategy/game/gameOutcomeStrategy';
import { Player } from '../../../src/core/model/player';
import { IMoveStrategy } from '../../../src/core/strategy/player/cliMoveStrategy';
import { ORANGE_IN_A_ROW_BOARD_UI } from '../../../src/composition/orangeInARowComposition';

describe('GameResultPresenter', () => {
  let outputAdapter: jest.Mocked<IOutputAdapter>;
  let boardPresenter: jest.Mocked<IOutputPresenter<BoardPresentArgs>>;
  let presenter: GameResultPresenter;
  let player1: Player;
  let player2: Player;
  let playerStrategy: IMoveStrategy;

  beforeEach(() => {
    playerStrategy = {
      createNextMove: jest.fn(),
    };

    player1 = new Player('Alice', playerStrategy);
    player2 = new Player('Bob', playerStrategy);

    outputAdapter = {
      render: jest.fn(),
    };

    boardPresenter = {
      present: jest.fn(),
    };

    presenter = new GameResultPresenter(boardPresenter, outputAdapter, ORANGE_IN_A_ROW_BOARD_UI);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
        [MARKER_X]: player1,
        [MARKER_O]: player2,
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

    expect(outputAdapter.render).toHaveBeenCalledWith('Alice (●) wins!');
  });

  test('renders final board and draw message', () => {
    const board: IBoard = [
      [MARKER_X, MARKER_O],
      [MARKER_O, MARKER_X],
    ];

    presenter.present({
      board,
      players: {
        [MARKER_X]: player1,
        [MARKER_O]: player2,
      },
      outcome: {
        type: GAME_OUTCOME.DRAW,
      },
    });

    expect(boardPresenter.present).toHaveBeenCalledWith({
      board,
    });

    expect(outputAdapter.render).toHaveBeenCalledWith("It's a draw.");
  });
});
