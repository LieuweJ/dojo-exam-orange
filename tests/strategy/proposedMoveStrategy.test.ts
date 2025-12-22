import { ProposedMoveStrategy } from '../../src/strategy/game/proposedMoveStrategy';
import { IValidator } from '../../src/validators/inputOutputValidator';
import {
  BoardState,
  IBoardConstraints,
  MARKER_O,
  MARKER_X,
  Move,
} from '../../src/model/boardState';
import { RuleViolation } from '../../src/model/rules';

describe('ProposedMoveStrategy', () => {
  const isValidMock = jest.fn();

  const validator: IValidator<Move, IBoardConstraints> = {
    isValid: isValidMock,
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('returns INVALID_MOVE when validator reports move as invalid', () => {
    const strategy = new ProposedMoveStrategy(validator);

    const move: Move = { marker: MARKER_X, column: 1 };
    const constraints = new BoardState([[]]);

    isValidMock.mockReturnValue(false);

    const result = strategy.check({ move, constraints });

    expect(isValidMock).toHaveBeenCalledWith(move, constraints);
    expect(result).toEqual(['INVALID_MOVE'] as RuleViolation[]);
  });

  test('returns null when validator reports move as valid', () => {
    const strategy = new ProposedMoveStrategy(validator);

    const move: Move = { marker: MARKER_O, column: 3 };
    const constraints = new BoardState([[]]);

    isValidMock.mockReturnValue(true);

    const result = strategy.check({ move, constraints });

    expect(isValidMock).toHaveBeenCalledWith(move, constraints);
    expect(result).toBeNull();
  });
});
