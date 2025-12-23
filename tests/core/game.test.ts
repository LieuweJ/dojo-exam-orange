import { Game } from '../../src/core/game';
import {
  BoardConstraint,
  BoardState,
  EMPTY_CELL,
  IBoardState,
} from '../../src/core/model/boardState';
import { BoardPresentArgs, IOutputPresenter } from '../../src/core/presenter/boardPresenter';
import { IMoveStrategy } from '../../src/core/strategy/player/cliMoveStrategy';
import { Player } from '../../src/core/model/player';
import {
  GAME_OUTCOME,
  GameOutcome,
  IGameOutcomeStrategy,
} from '../../src/core/strategy/game/gameOutcomeStrategy';
import { GameResultPresenterArgs } from '../../src/core/presenter/gameResultPresenter';
import {
  IncorrectMove,
  Move,
  RULES_VIOLATIONS,
  RuleStrategy,
  RuleViolation,
} from '../../src/core/model/rules';
import { TurnState } from '../../src/core/model/turnState';
import { RulesChainHandler } from '../../src/core/strategy/game/rules/rulesChainHandler';
import { GameLifecycleStrategy } from '../../src/core/strategy/game/gameLifecycleStrategy';
import { PIECE_O, PIECE_X } from '../../src/composition/orangeInARowComposition';

describe('A game of orange-in-a-row can be played', () => {
  let board: IBoardState & BoardConstraint;
  let boardPresenter: jest.Mocked<IOutputPresenter<BoardPresentArgs>>;
  let helpPresenter: jest.Mocked<IOutputPresenter<void>>;
  let game: Game;
  let moveStrategy: jest.Mocked<IMoveStrategy>;
  let gameOutcomeStrategy: jest.Mocked<IGameOutcomeStrategy>;
  let gameResultPresenter: jest.Mocked<IOutputPresenter<GameResultPresenterArgs>>;
  let playerX: Player;
  let playerO: Player;
  let players: Player[];
  let violationsPresenter: jest.Mocked<IOutputPresenter<IncorrectMove>>;
  let violationStrategy: jest.Mocked<RuleStrategy>;

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

    violationStrategy = {
      check: jest.fn(),
    };

    violationsPresenter = {
      present: jest.fn(),
    };

    playerX = new Player('Alice', moveStrategy, [PIECE_X]);
    playerO = new Player('Bob', moveStrategy, [PIECE_O]);

    players = [playerX, playerO];

    game = new Game(
      new TurnState({ players }),
      board,
      boardPresenter,
      helpPresenter,
      gameOutcomeStrategy,
      gameResultPresenter,
      new RulesChainHandler([violationStrategy]),
      violationsPresenter,
      new GameLifecycleStrategy()
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('new game presents the rules and the initial board', async () => {
    gameOutcomeStrategy.determine.mockReturnValueOnce({ type: GAME_OUTCOME.DRAW });

    moveStrategy.createNextMove.mockResolvedValue({
      column: col(4),
      marker: PIECE_X,
    });

    await game.play();

    expect(helpPresenter.present).toHaveBeenCalledTimes(1);
  });

  test('Board displays coins with correct colors for each player', async () => {
    moveStrategy.createNextMove
      .mockResolvedValueOnce({
        column: col(4),
        marker: PIECE_X,
      })
      .mockResolvedValueOnce({
        column: col(3),
        marker: PIECE_O,
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
        marker: PIECE_X,
      })
      .mockResolvedValueOnce({
        column: col(3),
        marker: PIECE_X,
      })
      .mockResolvedValueOnce({
        column: col(4),
        marker: PIECE_O,
      });

    await game.play();

    expect(moveStrategy.createNextMove).toHaveBeenCalledTimes(3);

    expect(moveStrategy.createNextMove.mock.calls[0][1]).toStrictEqual([PIECE_X]);
    expect(moveStrategy.createNextMove.mock.calls[1][1]).toStrictEqual([PIECE_O]);
    expect(moveStrategy.createNextMove.mock.calls[2][1]).toStrictEqual([PIECE_X]);
  });

  test('game stops when a winning outcome is returned', async () => {
    const outcome: GameOutcome = {
      type: GAME_OUTCOME.WIN,
      winner: playerX,
      winningPositions: [{ col: 4, row: 0 }],
    };

    gameOutcomeStrategy.determine.mockReturnValueOnce(outcome);

    moveStrategy.createNextMove.mockResolvedValueOnce({
      column: col(4),
      marker: PIECE_X,
    });

    await game.play();

    expect(gameResultPresenter.present).toHaveBeenLastCalledWith({
      board: board.getBoard(),
      outcome,
    });
  });

  test('throws when players are missing.', () => {
    expect(() => {
      new Game(
        new TurnState({ players: [new Player('Bob', moveStrategy, [PIECE_O])] }),
        board,
        boardPresenter,
        helpPresenter,
        gameOutcomeStrategy,
        gameResultPresenter,
        new RulesChainHandler([violationStrategy]),
        violationsPresenter,
        new GameLifecycleStrategy()
      );
    }).toThrow(new Error(`In order to play this game, we need at least 2 players.`));
  });

  test('player is notified when an invalid move is proposed', async () => {
    const invalidMove: Move = { column: col(10), marker: PIECE_X };
    const validMove: Move = { column: col(3), marker: PIECE_X };

    moveStrategy.createNextMove.mockResolvedValueOnce(invalidMove).mockResolvedValueOnce(validMove);

    const violation: RuleViolation = RULES_VIOLATIONS.INVALID_PLACEMENT;

    violationStrategy.check.mockReturnValueOnce([violation]).mockReturnValueOnce(null);

    gameOutcomeStrategy.determine.mockReturnValueOnce({ type: GAME_OUTCOME.DRAW });

    await game.play();

    expect(violationsPresenter.present).toHaveBeenCalledTimes(1);
    expect(violationsPresenter.present).toHaveBeenCalledWith({
      move: invalidMove,
      violations: [violation],
    });

    expect(moveStrategy.createNextMove).toHaveBeenCalledTimes(2);
  });
});

export const col = (n: number) => n;
