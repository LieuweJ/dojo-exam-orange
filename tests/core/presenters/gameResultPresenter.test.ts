import { GameOutcomePresenter } from '../../../src/core/presenter/gameOutcomePresenter';
import { BoardPresentArgs, IOutputPresenter } from '../../../src/core/presenter/boardPresenter';
import { IOutputAdapter } from '../../../src/core/adapters/terminalOutputAdapter';
import { EMPTY_CELL, IBoard } from '../../../src/core/model/boardState';
import { GAME_OUTCOME } from '../../../src/core/strategy/game/gameOutcomeStrategy';
import { Player } from '../../../src/core/model/player';
import { IMoveStrategy } from '../../../src/core/strategy/player/move-strategy';
import {
  PIECE_O,
  PIECE_X,
} from '../../../src/games/orange-in-a-row/composition/orangeInARowComposition';
import { GameHistory } from '../../../src/core/model/gameHistory';

describe('GameResultPresenter', () => {
  let outputAdapter: jest.Mocked<IOutputAdapter>;
  let boardPresenter: jest.Mocked<IOutputPresenter<BoardPresentArgs>>;
  let presenter: GameOutcomePresenter;
  let player1: Player;
  let playerStrategy: IMoveStrategy;

  beforeEach(() => {
    playerStrategy = {
      createNextMove: jest.fn(),
    };

    player1 = new Player('Alice', playerStrategy, [PIECE_X]);

    outputAdapter = {
      render: jest.fn(),
    };

    boardPresenter = {
      present: jest.fn(),
    };

    presenter = new GameOutcomePresenter(boardPresenter, outputAdapter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders winning board with highlights and winner message', () => {
    const board: IBoard = [
      [PIECE_X, PIECE_X, PIECE_X],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ];

    const gameHistory: GameHistory = new GameHistory(board);
    gameHistory.record({
      move: { piece: PIECE_X, position: { row: 0, column: 0 } },
      player: player1,
    });
    gameHistory.record({
      move: { piece: PIECE_X, position: { row: 0, column: 1 } },
      player: player1,
    });
    gameHistory.record({
      move: { piece: PIECE_X, position: { row: 0, column: 2 } },
      player: player1,
    });

    presenter.present({
      board,
      outcome: {
        type: GAME_OUTCOME.WIN,
        winner: player1,
        winningPositions: [
          { row: 0, column: 0 },
          { row: 0, column: 1 },
          { row: 0, column: 2 },
        ],
      },
      players: [],
      history: gameHistory,
    });

    expect(boardPresenter.present).toHaveBeenCalledWith({
      board,
      highlightPositions: [
        { row: 0, column: 0 },
        { row: 0, column: 1 },
        { row: 0, column: 2 },
      ],
      players: [],
    });

    expect(outputAdapter.render).toHaveBeenCalledWith('After 3 moves, Alice wins!');
  });

  test('renders final board and draw message', () => {
    const board: IBoard = [
      [PIECE_X, PIECE_O],
      [PIECE_O, PIECE_X],
    ];

    const player2 = new Player('Bob', playerStrategy, [PIECE_O]);

    const gameHistory: GameHistory = new GameHistory(board);
    gameHistory.record({
      move: { piece: PIECE_X, position: { row: 0, column: 0 } },
      player: player1,
    });
    gameHistory.record({
      move: { piece: PIECE_O, position: { row: 0, column: 1 } },
      player: player2,
    });
    gameHistory.record({
      move: { piece: PIECE_O, position: { row: 1, column: 0 } },
      player: player2,
    });
    gameHistory.record({
      move: { piece: PIECE_X, position: { row: 1, column: 1 } },
      player: player1,
    });

    presenter.present({
      board,
      outcome: {
        type: GAME_OUTCOME.DRAW,
      },
      players: [],
      history: gameHistory,
    });

    expect(boardPresenter.present).toHaveBeenCalledWith({
      board,
      players: [],
    });

    expect(outputAdapter.render).toHaveBeenCalledWith("After 4 moves, It's a draw.");
  });

  test('renders final draw message after one move', () => {
    const board: IBoard = [
      [PIECE_X, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL],
    ];

    const gameHistory: GameHistory = new GameHistory(board);
    gameHistory.record({
      move: { piece: PIECE_X, position: { row: 0, column: 0 } },
      player: player1,
    });

    presenter.present({
      board,
      outcome: {
        type: GAME_OUTCOME.DRAW,
      },
      players: [],
      history: gameHistory,
    });

    expect(boardPresenter.present).toHaveBeenCalledWith({
      board,
      players: [],
    });

    expect(outputAdapter.render).toHaveBeenCalledWith("After 1 move, It's a draw.");
  });
});
