import { MARKER_O, MARKER_X, PlayerBoardMarker } from '../../../../../src/core/model/boardState';
import { Move, RuleViolation } from '../../../../../src/core/model/rules';
import { ValidPlayerTurnStrategy } from '../../../../../src/core/strategy/game/rules/validPlayerTurnStrategy';

describe('ValidPlayerTurnStrategy', () => {
  let constraints: {
    board: {
      canAddMove: jest.Mock<boolean, [Move]>;
    };
    turn: {
      currentPlayerOwnsPiece: jest.Mock<boolean, [PlayerBoardMarker]>;
    };
  };

  beforeEach(() => {
    constraints = {
      board: {
        canAddMove: jest.fn(),
      },
      turn: {
        currentPlayerOwnsPiece: jest.fn(),
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('returns INVALID_MOVE when validator reports move as invalid', () => {
    const strategy = new ValidPlayerTurnStrategy();

    const move: Move = { marker: MARKER_X, column: 1 };
    constraints.turn.currentPlayerOwnsPiece.mockReturnValueOnce(false);

    const result = strategy.check({ move, moveContext: constraints });

    expect(constraints.turn.currentPlayerOwnsPiece).toHaveBeenCalledWith(move.marker);
    expect(result).toEqual(['INVALID_PLAYER_TURN'] as RuleViolation[]);
  });

  test('returns null when validator reports move as valid', () => {
    const strategy = new ValidPlayerTurnStrategy();

    const move: Move = { marker: MARKER_O, column: 3 };
    constraints.turn.currentPlayerOwnsPiece.mockReturnValueOnce(true);

    const result = strategy.check({ move, moveContext: constraints });

    expect(constraints.turn.currentPlayerOwnsPiece).toHaveBeenCalledWith(move.marker);
    expect(result).toBeNull();
  });
});
