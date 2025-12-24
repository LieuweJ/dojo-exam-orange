import { ValidPlacementStrategy } from '../../../../../src/core/strategy/game/rules/validPlacementStrategy';
import { Move, RuleViolation } from '../../../../../src/core/model/rules';
import { PIECE_O, PIECE_X } from '../../../../../src/composition/orangeInARowComposition';
import { Piece } from '../../../../../src/core/model/player';

describe('ValidPlacementStrategy', () => {
  let constraints: {
    board: {
      canAddMove: jest.Mock<boolean, [Move]>;
    };
    turn: {
      currentPlayerOwnsPiece: jest.Mock<boolean, [Piece]>;
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
    const strategy = new ValidPlacementStrategy();

    const move: Move = { piece: PIECE_X, position: 1 };
    constraints.board.canAddMove.mockReturnValueOnce(false);

    const result = strategy.check({ move, moveContext: constraints });

    expect(constraints.board.canAddMove).toHaveBeenCalledWith(move);
    expect(result).toEqual(['INVALID_PLACEMENT'] as RuleViolation[]);
  });

  test('returns null when validator reports move as valid', () => {
    const strategy = new ValidPlacementStrategy();

    const move: Move = { piece: PIECE_O, position: 3 };
    constraints.board.canAddMove.mockReturnValueOnce(true);

    const result = strategy.check({ move, moveContext: constraints });

    expect(constraints.board.canAddMove).toHaveBeenCalledWith(move);
    expect(result).toBeNull();
  });
});
