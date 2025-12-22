import { ValidPlacementStrategy } from '../../../../src/strategy/game/rules/validPlacementStrategy';
import { MARKER_O, MARKER_X } from '../../../../src/model/boardState';
import { Move, MoveConstraints, RuleViolation } from '../../../../src/model/rules';

describe('ValidPlacementStrategy', () => {
  let constraints: jest.Mocked<MoveConstraints>;

  beforeEach(() => {
    constraints = {
      canAddMove: jest.fn(),
      isCurrentPlayerMarker: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('returns INVALID_MOVE when validator reports move as invalid', () => {
    const strategy = new ValidPlacementStrategy();

    const move: Move = { marker: MARKER_X, column: 1 };
    constraints.canAddMove.mockReturnValueOnce(false);

    const result = strategy.check({ move, constraints });

    expect(constraints.canAddMove).toHaveBeenCalledWith(move);
    expect(result).toEqual(['INVALID_PLACEMENT'] as RuleViolation[]);
  });

  test('returns null when validator reports move as valid', () => {
    const strategy = new ValidPlacementStrategy();

    const move: Move = { marker: MARKER_O, column: 3 };
    constraints.canAddMove.mockReturnValueOnce(true);

    const result = strategy.check({ move, constraints });

    expect(constraints.canAddMove).toHaveBeenCalledWith(move);
    expect(result).toBeNull();
  });
});
