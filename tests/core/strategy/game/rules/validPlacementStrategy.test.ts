import { ValidPlacementStrategy } from '../../../../../src/core/strategy/game/rules/validPlacementStrategy';
import { MARKER_O, MARKER_X, PlayerBoardMarker } from '../../../../../src/core/model/boardState';
import { Move, RuleViolation } from '../../../../../src/core/model/rules';

describe('ValidPlacementStrategy', () => {
  let constraints: {
    board: {
      canAddMove: jest.Mock<boolean, [Move]>;
    };
    turn: {
      isCurrentPlayerMarker: jest.Mock<boolean, [PlayerBoardMarker]>;
    };
  };

  beforeEach(() => {
    constraints = {
      board: {
        canAddMove: jest.fn(),
      },
      turn: {
        isCurrentPlayerMarker: jest.fn(),
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('returns INVALID_MOVE when validator reports move as invalid', () => {
    const strategy = new ValidPlacementStrategy();

    const move: Move = { marker: MARKER_X, column: 1 };
    constraints.board.canAddMove.mockReturnValueOnce(false);

    const result = strategy.check({ move, moveContext: constraints });

    expect(constraints.board.canAddMove).toHaveBeenCalledWith(move);
    expect(result).toEqual(['INVALID_PLACEMENT'] as RuleViolation[]);
  });

  test('returns null when validator reports move as valid', () => {
    const strategy = new ValidPlacementStrategy();

    const move: Move = { marker: MARKER_O, column: 3 };
    constraints.board.canAddMove.mockReturnValueOnce(true);

    const result = strategy.check({ move, moveContext: constraints });

    expect(constraints.board.canAddMove).toHaveBeenCalledWith(move);
    expect(result).toBeNull();
  });
});
