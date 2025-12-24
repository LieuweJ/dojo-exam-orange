import { Move, RuleViolation } from '../../../../../src/core/model/rules';
import { ValidPlayerTurnStrategy } from '../../../../../src/core/strategy/game/rules/validPlayerTurnStrategy';
import {
  PIECE_O,
  PIECE_X,
} from '../../../../../src/games/orange-in-a-row/composition/orangeInARowComposition';
import { Piece } from '../../../../../src/core/model/player';

describe('ValidPlayerTurnStrategy', () => {
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
    const strategy = new ValidPlayerTurnStrategy();

    const move: Move = { piece: PIECE_X, position: { column: 1, row: 0 } };
    constraints.turn.currentPlayerOwnsPiece.mockReturnValueOnce(false);

    const result = strategy.check({ move, moveContext: constraints });

    expect(constraints.turn.currentPlayerOwnsPiece).toHaveBeenCalledWith(move.piece);
    expect(result).toEqual(['INVALID_PLAYER_TURN'] as RuleViolation[]);
  });

  test('returns null when validator reports move as valid', () => {
    const strategy = new ValidPlayerTurnStrategy();

    const move: Move = { piece: PIECE_O, position: { column: 3, row: 0 } };
    constraints.turn.currentPlayerOwnsPiece.mockReturnValueOnce(true);

    const result = strategy.check({ move, moveContext: constraints });

    expect(constraints.turn.currentPlayerOwnsPiece).toHaveBeenCalledWith(move.piece);
    expect(result).toBeNull();
  });
});
