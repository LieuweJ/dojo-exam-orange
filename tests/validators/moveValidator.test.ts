import { MoveValidator } from '../../src/validators/moveValidator';
import { EMPTY_CELL, IBoard, MARKER_O, MARKER_X, Move } from '../../src/model/boardState';

describe('MoveValidator', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('returns true when the target column cell is empty', () => {
    const validator = new MoveValidator();

    const board: IBoard = [[EMPTY_CELL, EMPTY_CELL, EMPTY_CELL]] as IBoard;

    const move: Move = {
      marker: MARKER_X,
      column: 1,
    } as Move;

    const result = validator.isValid(move, board);

    expect(result).toBe(true);
  });

  test('returns false when the target column cell is not empty', () => {
    const validator = new MoveValidator();

    const board: IBoard = [['X', EMPTY_CELL, EMPTY_CELL]] as IBoard;

    const move: Move = {
      marker: MARKER_O,
      column: 0,
    } as Move;

    const result = validator.isValid(move, board);

    expect(result).toBe(false);
  });
});
