import { ColumnInputHandler } from '../../handlers/columnInputHandler';
import { IInputAdapter } from '../../adapters/terminalInputAdapter';
import { EMPTY_CELL, IBoard } from '../../model/board';
import { ColumnValidator } from '../../validators/columnValidator';
import { IOutputAdapter } from '../../adapters/terminalOutputAdapter';

describe('ColumnInputHandler', () => {
  let inputAdapter: jest.Mocked<IInputAdapter>;
  let outputAdapter: jest.Mocked<IOutputAdapter>;
  let handler: ColumnInputHandler;

  beforeEach(() => {
    inputAdapter = {
      ask: jest.fn(),
    };

    outputAdapter = {
      render: jest.fn(),
    };

    handler = new ColumnInputHandler(inputAdapter, outputAdapter, new ColumnValidator());
  });

  test('returns the column number when a valid column is entered', async () => {
    const board: IBoard = [
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL]
    ];

    inputAdapter.ask.mockResolvedValueOnce('2');

    const column = await handler.askFor(board);

    expect(column).toBe(1);
    expect(inputAdapter.ask).toHaveBeenCalledWith('Choose column (1-3):');
  });

  test('displays error when input is invalid', async () => {
    const board: IBoard = [
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL]
    ];

    inputAdapter.ask.mockResolvedValueOnce('5');
    inputAdapter.ask.mockResolvedValueOnce('1');

    await handler.askFor(board);

    expect(inputAdapter.ask).toHaveBeenCalledWith('Choose column (1-3):');
    expect(outputAdapter.render).toHaveBeenCalledWith('Column 5 is full or invalid. Please choose another column.');
    expect(inputAdapter.ask).toHaveBeenCalledWith('Choose column (1-3):');
  });
});
