import { Game, PlayersByMarker } from '../src/game';
import { BoardState, IBoardState, MARKER_O, MARKER_X, ColumnIndex, EMPTY_CELL } from '../src/model/boardState';
import { BoardPresentArgs, IOutputPresenter } from '../src/presenter/boardPresenter';
import { IMoveStrategy } from '../src/strategy/player/cliMoveStrategy';
import { Player } from '../src/model/player';
import { GAME_OUTCOME, GameOutcome, IGameOutcomeStrategy } from '../src/strategy/game/gameOutcomeStrategy';
import { GameResultPresenterArgs } from '../src/presenter/gameResultPresenter';

describe('A game of orange-in-a-row can be played', () => {
  let board: IBoardState;
  let boardPresenterSpy: jest.Mocked<IOutputPresenter<BoardPresentArgs>>;
  let helpPresenterSpy: jest.Mocked<IOutputPresenter<void>>;
  let game: Game;
  let moveStrategy: jest.Mocked<IMoveStrategy>;
  let gameOutcomeStrategy: jest.Mocked<IGameOutcomeStrategy>;
  let gameResultPresenterSpy: jest.Mocked<IOutputPresenter<GameResultPresenterArgs>>;
  let players: PlayersByMarker;

  beforeEach(() => {
    board = new BoardState([
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ]);

    boardPresenterSpy = {
      present: jest.fn(),
    };

    helpPresenterSpy = {
      present: jest.fn(),
    };

    moveStrategy = {
      createNextMove: jest.fn(),
    };

    gameOutcomeStrategy = {
      determine: jest.fn(),
    };

    gameResultPresenterSpy = {
      present: jest.fn(),
    };

    players = {
      [MARKER_X]: new Player('Alice', moveStrategy),
      [MARKER_O]: new Player('Bob', moveStrategy),
    }

    game = new Game(
      players,
      board,
      boardPresenterSpy,
      helpPresenterSpy,
      gameOutcomeStrategy,
      gameResultPresenterSpy
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('new game presents the rules and the initial board', async () => {
    gameOutcomeStrategy.determine
      .mockReturnValueOnce({ type: GAME_OUTCOME.DRAW });

    moveStrategy.createNextMove.mockResolvedValue({
      column: col(4),
      marker: MARKER_X
    });

    await game.play();

    expect(helpPresenterSpy.present).toHaveBeenCalledTimes(1);
  });

  test('Board displays coins with correct colors for each player', async () => {
    moveStrategy.createNextMove
      .mockResolvedValueOnce({
        column: col(4),
        marker: MARKER_X
      })
      .mockResolvedValueOnce({
        column: col(3),
        marker: MARKER_O
      });

    gameOutcomeStrategy.determine
      .mockReturnValueOnce({ type: GAME_OUTCOME.ONGOING })
      .mockReturnValueOnce({ type: GAME_OUTCOME.DRAW });

    await game.play();

    expect(helpPresenterSpy.present).toHaveBeenCalledTimes(1);
    expect(boardPresenterSpy.present).toHaveBeenCalledTimes(2);
    expect(gameResultPresenterSpy.present).toHaveBeenLastCalledWith(
      expect.objectContaining({
        board: board.getBoard(),
      })
    );
  });

  test('players alternate turns (switchPlayer is applied)', async () => {
    gameOutcomeStrategy.determine
      .mockReturnValueOnce({ type: GAME_OUTCOME.ONGOING })
      .mockReturnValueOnce({ type: GAME_OUTCOME.ONGOING })
      .mockReturnValueOnce({ type: GAME_OUTCOME.DRAW });

    moveStrategy.createNextMove
      .mockResolvedValueOnce({
        column: col(4),
        marker: MARKER_X
      })
      .mockResolvedValueOnce({
        column: col(3),
        marker: MARKER_X
      })
      .mockResolvedValueOnce({
        column: col(4),
        marker: MARKER_O
      });

    await game.play();

    expect(moveStrategy.createNextMove).toHaveBeenCalledTimes(3);

    expect(moveStrategy.createNextMove.mock.calls[0][1]).toBe(MARKER_X);
    expect(moveStrategy.createNextMove.mock.calls[1][1]).toBe(MARKER_O);
    expect(moveStrategy.createNextMove.mock.calls[2][1]).toBe(MARKER_X);
  });

  test('game stops when a winning outcome is returned', async () => {
    const outcome: GameOutcome = { type: GAME_OUTCOME.WIN, winner: MARKER_X, winningPositions: [{col: 4, row: 0}] };

    gameOutcomeStrategy.determine
      .mockReturnValueOnce(outcome);

    moveStrategy.createNextMove
      .mockResolvedValueOnce({
        column: col(4),
        marker: MARKER_X
      });

    await game.play();

    expect(gameResultPresenterSpy.present).toHaveBeenLastCalledWith(
      { board: board.getBoard(), outcome, players },
    );
  });

  test('throws when player for MARKER_X is missing', () => {
    expect(() => {
      new Game(
        // @ts-ignore - Necessary to test missing player
        {
          [MARKER_O]: new Player('Bob', moveStrategy),
        },
        board,
        boardPresenterSpy,
        helpPresenterSpy,
        gameOutcomeStrategy,
        gameResultPresenterSpy
      );
    }).toThrow(
      new Error(`Player for marker ${MARKER_X.toString()} is missing.`)
    );
  });

  test('throws when player for MARKER_O is missing', () => {
    expect(() => {
      new Game(
        // @ts-ignore - Necessary to test missing player
        {
          [MARKER_X]: new Player('Alice', moveStrategy),
        },
        board,
        boardPresenterSpy,
        helpPresenterSpy,
        gameOutcomeStrategy,
        gameResultPresenterSpy
      );
    }).toThrow(
      new Error(`Player for marker ${MARKER_O.toString()} is missing.`)
    );
  });

});

export const col = (n: number) => n;