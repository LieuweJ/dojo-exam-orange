import { ProposedMoveStrategy } from '../../src/strategy/game/proposedMoveStrategy';
import { IValidator } from '../../src/validators/inputOutputValidator';
import { IBoard, MARKER_O, MARKER_X, Move } from '../../src/model/boardState';
import { RuleViolation } from '../../src/model/rules';

describe('ProposedMoveStrategy', () => {
  const isValidMock = jest.fn();

  const validator: IValidator<Move, IBoard> = {
    isValid: isValidMock,
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('returns INVALID_MOVE when validator reports move as invalid', () => {
    const strategy = new ProposedMoveStrategy(validator);

    const move: Move = { marker: MARKER_X, column: 1 };
    const board = {} as IBoard;

    isValidMock.mockReturnValue(false);

    const result = strategy.check({ move, board });

    expect(isValidMock).toHaveBeenCalledWith(move, board);
    expect(result).toEqual(['INVALID_MOVE'] as RuleViolation[]);
  });

  test('returns null when validator reports move as valid', () => {
    const strategy = new ProposedMoveStrategy(validator);

    const move: Move = { marker: MARKER_O, column: 3 };
    const board = {} as IBoard;

    isValidMock.mockReturnValue(true);

    const result = strategy.check({ move, board });

    expect(isValidMock).toHaveBeenCalledWith(move, board);
    expect(result).toBeNull();
  });
});
