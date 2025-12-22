import { MARKER_O, MARKER_X } from '../../../../src/model/boardState';
import { Move, MoveConstraints, RuleViolation } from '../../../../src/model/rules';
import { ValidPlayerTurnStrategy } from '../../../../src/strategy/game/rules/validPlayerTurnStrategy';

describe('ValidPlayerTurnStrategy', () => {
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
    const strategy = new ValidPlayerTurnStrategy();

    const move: Move = { marker: MARKER_X, column: 1 };
    constraints.isCurrentPlayerMarker.mockReturnValueOnce(false);

    const result = strategy.check({ move, constraints });

    expect(constraints.isCurrentPlayerMarker).toHaveBeenCalledWith(move.marker);
    expect(result).toEqual(['INVALID_PLAYER_TURN'] as RuleViolation[]);
  });

  test('returns null when validator reports move as valid', () => {
    const strategy = new ValidPlayerTurnStrategy();

    const move: Move = { marker: MARKER_O, column: 3 };
    constraints.isCurrentPlayerMarker.mockReturnValueOnce(true);

    const result = strategy.check({ move, constraints });

    expect(constraints.isCurrentPlayerMarker).toHaveBeenCalledWith(move.marker);
    expect(result).toBeNull();
  });
});
