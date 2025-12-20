import { Game, PlayersByMarker } from '../src/game';
import { BoardState, IBoardState, IBoard, MARKER_O, MARKER_X, ColumnIndex, EMPTY_CELL } from '../src/model/boardState';
import { IOutputPresenter } from '../src/presenter/output/boardPresenter';
import { IMoveStrategy } from '../src/strategy/cliMoveStrategy';
import { Player } from '../src/model/player';
import { GAME_OUTCOME, IGameOutcomeStrategy } from '../src/strategy/gameOutcomeStrategy';

describe('A game of orange-in-a-row can be played', () => {
  let board: IBoardState;
  let boardPresenterSpy: jest.Mocked<IOutputPresenter<IBoard>>;
  let helpPresenterSpy: jest.Mocked<IOutputPresenter<void>>;
  let game: Game;
  let columnInputHandlerSpy: jest.Mocked<IMoveStrategy>;
  let gameOutcomeStrategy: jest.Mocked<IGameOutcomeStrategy>;

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

    columnInputHandlerSpy = {
      createNextMove: jest.fn(),
    };

    gameOutcomeStrategy = {
      determine: jest.fn(),
    };

    game = new Game(
      {
        [MARKER_X]: new Player('Alice'),
        [MARKER_O]: new Player('Bob'),
      },
      board,
      boardPresenterSpy,
      helpPresenterSpy,
      columnInputHandlerSpy,
      gameOutcomeStrategy
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('new game presents the rules and the initial board', async () => {
    gameOutcomeStrategy.determine
      .mockReturnValueOnce({ type: GAME_OUTCOME.DRAW });

    columnInputHandlerSpy.createNextMove.mockResolvedValue(col(4));

    await game.play();

    expect(helpPresenterSpy.present).toHaveBeenCalledTimes(1);
    expect(boardPresenterSpy.present).toHaveBeenCalledWith(
      board.getBoard(),
    );
  });

  test('Board displays coins with correct colors for each player', async () => {
    columnInputHandlerSpy.createNextMove
      .mockResolvedValueOnce(col(4))
      .mockResolvedValueOnce(col(3));

    gameOutcomeStrategy.determine
      .mockReturnValueOnce({ type: GAME_OUTCOME.ONGOING })
      .mockReturnValueOnce({ type: GAME_OUTCOME.DRAW });

    await game.play();

    expect(helpPresenterSpy.present).toHaveBeenCalledTimes(1);
    expect(boardPresenterSpy.present).toHaveBeenCalledTimes(3);
    expect(boardPresenterSpy.present).toHaveBeenLastCalledWith(
      board.getBoard(),
    );
  });

  test('players alternate turns (switchPlayer is applied)', async () => {
    gameOutcomeStrategy.determine
      .mockReturnValueOnce({ type: GAME_OUTCOME.ONGOING })
      .mockReturnValueOnce({ type: GAME_OUTCOME.ONGOING })
      .mockReturnValueOnce({ type: GAME_OUTCOME.DRAW });

    columnInputHandlerSpy.createNextMove
      .mockResolvedValueOnce(col(4))
      .mockResolvedValueOnce(col(3))
      .mockResolvedValueOnce(col(1));

    await game.play();

    expect(columnInputHandlerSpy.createNextMove).toHaveBeenCalledTimes(3);

    const firstCallPlayer = columnInputHandlerSpy.createNextMove.mock.calls[0][1];
    const secondCallPlayer = columnInputHandlerSpy.createNextMove.mock.calls[1][1];
    const thirdCallPlayer = columnInputHandlerSpy.createNextMove.mock.calls[2][1];

    expect(firstCallPlayer.getScreenName()).toBe('Alice');
    expect(secondCallPlayer.getScreenName()).toBe('Bob');
    expect(thirdCallPlayer.getScreenName()).toBe('Alice');
  });

  test('game stops when a winning outcome is returned', async () => {
    gameOutcomeStrategy.determine
      .mockReturnValueOnce({ type: GAME_OUTCOME.WIN, winner: MARKER_X, winningPositions: [] });

    columnInputHandlerSpy.createNextMove
      .mockResolvedValueOnce(col(4));

    await game.play();

    expect(helpPresenterSpy.present).toHaveBeenCalledTimes(1);

    expect(boardPresenterSpy.present).toHaveBeenCalledTimes(2);
    expect(boardPresenterSpy.present).toHaveBeenLastCalledWith(
      board.getBoard()
    );

    expect(columnInputHandlerSpy.createNextMove).toHaveBeenCalledTimes(1);
  });

  test('throws when player for MARKER_X is missing', () => {
    expect(() => {
      new Game(
        {
          [MARKER_O]: new Player('Bob'),
        } as PlayersByMarker,
        board,
        boardPresenterSpy,
        helpPresenterSpy,
        columnInputHandlerSpy,
        gameOutcomeStrategy
      );
    }).toThrow(
      new Error(`Player for marker ${MARKER_X.toString()} is missing.`)
    );
  });

  test('throws when player for MARKER_O is missing', () => {
    expect(() => {
      new Game(
        {
          [MARKER_X]: new Player('Alice'),
        } as PlayersByMarker,
        board,
        boardPresenterSpy,
        helpPresenterSpy,
        columnInputHandlerSpy,
        gameOutcomeStrategy
      );
    }).toThrow(
      new Error(`Player for marker ${MARKER_O.toString()} is missing.`)
    );
  });

});

export const col = (n: number) => n as ColumnIndex;