import { ValidLineGamePlacementStrategy } from '../../../../../../src/sharedMechanics/connectLineGame/strategy/game/rules/validLineGamePlacementStrategy';
import { Move, RuleViolation } from '../../../../../../src/core/model/rules';
import {
  PIECE_O,
  PIECE_X,
} from '../../../../../../src/games/orange-in-a-row/composition/orangeInARowComposition';
import { BoardState, EMPTY_CELL, IBoard } from '../../../../../../src/core/model/boardState';
import { TurnState } from '../../../../../../src/core/model/turnState';
import { Player } from '../../../../../../src/core/model/player';
import { IMoveStrategy } from '../../../../../../src/core/strategy/player/move-strategy';

describe('ValidPlacementStrategy', () => {
  const e = EMPTY_CELL;
  let player1: Player;
  let player2: Player;

  let turnState: TurnState;

  let playerStrategy: jest.Mocked<IMoveStrategy>;

  beforeEach(() => {
    playerStrategy = {
      createNextMove: jest.fn(),
    };

    player1 = new Player('Player 1', playerStrategy, [PIECE_X]);
    player2 = new Player('Player 2', playerStrategy, [PIECE_O]);

    turnState = new TurnState({
      players: [player1, player2],
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('returns INVALID_MOVE when validator reports move as invalid.', () => {
    const boardWithOccupiedCell: IBoard = [
      [e, PIECE_X, e],
      [e, e, e],
    ];

    const move: Move = { piece: PIECE_X, position: { column: 1, row: 0 } };
    const moveContext = {
      board: new BoardState(boardWithOccupiedCell),
      turn: new TurnState(turnState),
    };

    const strategy = new ValidLineGamePlacementStrategy();

    const result = strategy.check({ move, moveContext });

    expect(result).toEqual(['INVALID_PLACEMENT'] as RuleViolation[]);
  });

  test('returns null when validator reports move as valid.', () => {
    const move: Move = { piece: PIECE_O, position: { column: 1, row: 0 } };
    const emptyBoard: IBoard = [
      [e, e, e],
      [e, e, e],
    ];

    const moveContext = {
      board: new BoardState(emptyBoard),
      turn: new TurnState(turnState),
    };

    const strategy = new ValidLineGamePlacementStrategy();

    const result = strategy.check({ move, moveContext });

    expect(result).toBeNull();
  });
});
