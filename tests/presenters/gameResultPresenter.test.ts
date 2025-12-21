import { GameResultPresenter } from '../../src/presenter/gameResultPresenter';
import { BoardPresentArgs, BoardPresenter, IOutputPresenter } from '../../src/presenter/boardPresenter';
import { IOutputAdapter } from '../../src/adapters/terminalOutputAdapter';
import { EMPTY_CELL, IBoard, MARKER_O, MARKER_X } from '../../src/model/boardState';
import { GAME_OUTCOME } from '../../src/strategy/game/gameOutcomeStrategy';
import { PlayersByMarker } from '../../src/game';
import { Player } from '../../src/model/player';
import { IMoveStrategy } from '../../src/strategy/player/cliMoveStrategy';

describe('GameResultPresenter', () => {
  let outputAdapter: jest.Mocked<IOutputAdapter>;
  let boardPresenter: jest.Mocked<IOutputPresenter<BoardPresentArgs>>;
  let presenter: GameResultPresenter;
  let player1: Player;
  let player2: Player;
  let playerStrategy: IMoveStrategy

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
    }

    presenter = new GameResultPresenter(boardPresenter, outputAdapter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

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

    expect(outputAdapter.render).toHaveBeenCalledWith(
      "It's a draw."
    );
  });
});
