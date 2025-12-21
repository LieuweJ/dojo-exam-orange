import { Game, PlayersByMarker } from '../src/game';
import {
  BoardState,
  EMPTY_CELL,
  IBoardState,
  MARKER_O,
  MARKER_X,
  Move,
} from '../src/model/boardState';
import { BoardPresentArgs, IOutputPresenter } from '../src/presenter/boardPresenter';
import { IMoveStrategy } from '../src/strategy/player/cliMoveStrategy';
import { Player } from '../src/model/player';
import {
  GAME_OUTCOME,
  GameOutcome,
  IGameOutcomeStrategy,
} from '../src/strategy/game/gameOutcomeStrategy';
import { GameResultPresenterArgs } from '../src/presenter/gameResultPresenter';
import { IncorrectMove, IRuleChecker, RULES_VIOLATIONS, RuleViolation } from '../src/model/rules';
import { MoveForBoard } from '../src/strategy/game/proposedMoveStrategy';

describe('A game of orange-in-a-row can be played', () => {
  let board: IBoardState;
  let boardPresenter: jest.Mocked<IOutputPresenter<BoardPresentArgs>>;
  let helpPresenter: jest.Mocked<IOutputPresenter<void>>;
  let game: Game;
  let moveStrategy: jest.Mocked<IMoveStrategy>;
  let gameOutcomeStrategy: jest.Mocked<IGameOutcomeStrategy>;
  let gameResultPresenter: jest.Mocked<IOutputPresenter<GameResultPresenterArgs>>;
  let players: PlayersByMarker;
  let xViolationsPresenter: jest.Mocked<IOutputPresenter<IncorrectMove>>;
  let oViolationsPresenter: jest.Mocked<IOutputPresenter<IncorrectMove>>;
  let moveValidator: jest.Mocked<IRuleChecker<MoveForBoard>>;

  beforeEach(() => {
    board = new BoardState([
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ]);

    boardPresenter = {
      present: jest.fn(),
    };

    helpPresenter = {
      present: jest.fn(),
    };

    moveStrategy = {
      createNextMove: jest.fn(),
    };

    gameOutcomeStrategy = {
      determine: jest.fn(),
    };

    gameResultPresenter = {
      present: jest.fn(),
    };

    xViolationsPresenter = {
      present: jest.fn(),
    };

    oViolationsPresenter = {
      present: jest.fn(),
    };

    moveValidator = {
      check: jest.fn(),
    };

    players = {
      [MARKER_X]: new Player('Alice', moveStrategy, xViolationsPresenter),
      [MARKER_O]: new Player('Bob', moveStrategy, oViolationsPresenter),
    };

    game = new Game(
      players,
      board,
      boardPresenter,
      helpPresenter,
      gameOutcomeStrategy,
      gameResultPresenter,
      moveValidator
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('new game presents the rules and the initial board', async () => {
    gameOutcomeStrategy.determine.mockReturnValueOnce({ type: GAME_OUTCOME.DRAW });

    moveStrategy.createNextMove.mockResolvedValue({
      column: col(4),
      marker: MARKER_X,
    });

    await game.play();

    expect(helpPresenter.present).toHaveBeenCalledTimes(1);
  });

  test('Board displays coins with correct colors for each player', async () => {
    moveStrategy.createNextMove
      .mockResolvedValueOnce({
        column: col(4),
        marker: MARKER_X,
      })
      .mockResolvedValueOnce({
        column: col(3),
        marker: MARKER_O,
      });

    gameOutcomeStrategy.determine
      .mockReturnValueOnce({ type: GAME_OUTCOME.ONGOING })
      .mockReturnValueOnce({ type: GAME_OUTCOME.DRAW });

    await game.play();

    expect(helpPresenter.present).toHaveBeenCalledTimes(1);
    expect(boardPresenter.present).toHaveBeenCalledTimes(2);
    expect(gameResultPresenter.present).toHaveBeenLastCalledWith(
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
        marker: MARKER_X,
      })
      .mockResolvedValueOnce({
        column: col(3),
        marker: MARKER_X,
      })
      .mockResolvedValueOnce({
        column: col(4),
        marker: MARKER_O,
      });

    await game.play();

    expect(moveStrategy.createNextMove).toHaveBeenCalledTimes(3);

    expect(moveStrategy.createNextMove.mock.calls[0][1]).toBe(MARKER_X);
    expect(moveStrategy.createNextMove.mock.calls[1][1]).toBe(MARKER_O);
    expect(moveStrategy.createNextMove.mock.calls[2][1]).toBe(MARKER_X);
  });

  test('game stops when a winning outcome is returned', async () => {
    const outcome: GameOutcome = {
      type: GAME_OUTCOME.WIN,
      winner: MARKER_X,
      winningPositions: [{ col: 4, row: 0 }],
    };

    gameOutcomeStrategy.determine.mockReturnValueOnce(outcome);

    moveStrategy.createNextMove.mockResolvedValueOnce({
      column: col(4),
      marker: MARKER_X,
    });

    await game.play();

    expect(gameResultPresenter.present).toHaveBeenLastCalledWith({
      board: board.getBoard(),
      outcome,
      players,
    });
  });

  test('throws when player for MARKER_X is missing', () => {
    expect(() => {
      new Game(
        // @ts-expect-error - Necessary to test missing player
        {
          [MARKER_O]: new Player('Bob', moveStrategy, oViolationsPresenter),
        },
        board,
        boardPresenter,
        helpPresenter,
        gameOutcomeStrategy,
        gameResultPresenter,
        moveValidator
      );
    }).toThrow(new Error(`Player for marker ${MARKER_X.toString()} is missing.`));
  });

  test('throws when player for MARKER_O is missing', () => {
    expect(() => {
      new Game(
        // @ts-expect-error - Necessary to test missing player
        {
          [MARKER_X]: new Player('Alice', moveStrategy, xViolationsPresenter),
        },
        board,
        boardPresenter,
        helpPresenter,
        gameOutcomeStrategy,
        gameResultPresenter,
        moveValidator
      );
    }).toThrow(new Error(`Player for marker ${MARKER_O.toString()} is missing.`));
  });

  test('player is notified when an invalid move is proposed', async () => {
    const invalidMove: Move = { column: col(10), marker: MARKER_X };
    const validMove: Move = { column: col(3), marker: MARKER_X };

    moveStrategy.createNextMove.mockResolvedValueOnce(invalidMove).mockResolvedValueOnce(validMove);

    const violation: RuleViolation = RULES_VIOLATIONS.INVALID_MOVE;

    moveValidator.check.mockReturnValueOnce([violation]).mockReturnValueOnce(null);

    gameOutcomeStrategy.determine.mockReturnValueOnce({ type: GAME_OUTCOME.DRAW });

    await game.play();

    expect(xViolationsPresenter.present).toHaveBeenCalledTimes(1);
    expect(xViolationsPresenter.present).toHaveBeenCalledWith({
      move: invalidMove,
      violations: [violation],
    });

    expect(oViolationsPresenter.present).not.toHaveBeenCalled();

    expect(moveStrategy.createNextMove).toHaveBeenCalledTimes(2);
  });
});

export const col = (n: number) => n;
