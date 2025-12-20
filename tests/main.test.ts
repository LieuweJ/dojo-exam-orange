import { Game, PlayersByMarker } from '../src/game';
import { BoardState, IBoardState, IBoard, MARKER_O, MARKER_X, ColumnIndex, EMPTY_CELL } from '../src/model/boardState';
import { IOutputPresenter } from '../src/presenter/boardPresenter';
import { IMoveStrategy } from '../src/strategy/player/cliMoveStrategy';
import { Player } from '../src/model/player';
import { GAME_OUTCOME, IGameOutcomeStrategy } from '../src/strategy/game/gameOutcomeStrategy';

describe('A game of orange-in-a-row can be played', () => {
  let board: IBoardState;
  let boardPresenterSpy: jest.Mocked<IOutputPresenter<IBoard>>;
  let helpPresenterSpy: jest.Mocked<IOutputPresenter<void>>;
  let game: Game;
  let moveStrategy: jest.Mocked<IMoveStrategy>;
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

    moveStrategy = {
      createNextMove: jest.fn(),
    };

    gameOutcomeStrategy = {
      determine: jest.fn(),
    };

    game = new Game(
      {
        [MARKER_X]: new Player('Alice', moveStrategy),
        [MARKER_O]: new Player('Bob', moveStrategy),
      },
      board,
      boardPresenterSpy,
      helpPresenterSpy,
      gameOutcomeStrategy
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
    expect(boardPresenterSpy.present).toHaveBeenCalledWith(
      board.getBoard(),
    );
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
    gameOutcomeStrategy.determine
      .mockReturnValueOnce({ type: GAME_OUTCOME.WIN, winner: MARKER_X, winningPositions: [] });

    moveStrategy.createNextMove
      .mockResolvedValueOnce({
        column: col(4),
        marker: MARKER_X
      });

    await game.play();

    expect(helpPresenterSpy.present).toHaveBeenCalledTimes(1);

    expect(boardPresenterSpy.present).toHaveBeenCalledTimes(2);
    expect(boardPresenterSpy.present).toHaveBeenLastCalledWith(
      board.getBoard()
    );

    expect(moveStrategy.createNextMove).toHaveBeenCalledTimes(1);
  });

  test('throws when player for MARKER_X is missing', () => {
    expect(() => {
      new Game(
        {
          [MARKER_O]: new Player('Bob', moveStrategy),
        } as PlayersByMarker,
        board,
        boardPresenterSpy,
        helpPresenterSpy,
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
          [MARKER_X]: new Player('Alice', moveStrategy),
        } as PlayersByMarker,
        board,
        boardPresenterSpy,
        helpPresenterSpy,
        gameOutcomeStrategy
      );
    }).toThrow(
      new Error(`Player for marker ${MARKER_O.toString()} is missing.`)
    );
  });

});

export const col = (n: number) => n as ColumnIndex;