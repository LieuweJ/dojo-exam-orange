import { ColumnInputHandler } from '../../handlers/columnInputHandler';
import { IInputAdapter } from '../../adapters/terminalInputAdapter';
import { EMPTY_CELL, IBoard } from '../../model/board';

describe('ColumnInputHandler', () => {
  let inputAdapter: jest.Mocked<IInputAdapter>;
  let handler: ColumnInputHandler;

  beforeEach(() => {
    inputAdapter = {
      ask: jest.fn(),
    };

    handler = new ColumnInputHandler(inputAdapter);
  });

  test('returns the column number when a valid column is entered', async () => {
    const board: IBoard = [
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL]
    ];

    inputAdapter.ask.mockResolvedValueOnce('2');

    const column = await handler.askFor(board);

    expect(column).toBe(2);
    expect(inputAdapter.ask).toHaveBeenCalledWith('Choose column (1-3):');
  });
});
