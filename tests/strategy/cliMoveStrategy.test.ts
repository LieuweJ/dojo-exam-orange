import { CliMoveStrategy } from '../../src/strategy/cliMoveStrategy';
import { IInputAdapter } from '../../src/adapters/terminalInputAdapter';
import { EMPTY_CELL, IBoard } from '../../src/model/boardState';
import { AvailableColumnValidator } from '../../src/validators/availableColumnValidator';
import { IOutputAdapter } from '../../src/adapters/terminalOutputAdapter';
import { Player } from '../../src/model/player';

describe('CliMoveStrategy', () => {
  let inputAdapter: jest.Mocked<IInputAdapter>;
  let outputAdapter: jest.Mocked<IOutputAdapter>;
  let moveStrategy: CliMoveStrategy;

  beforeEach(() => {
    inputAdapter = {
      ask: jest.fn(),
    };

    outputAdapter = {
      render: jest.fn(),
    };

    moveStrategy = new CliMoveStrategy(inputAdapter, outputAdapter, new AvailableColumnValidator());
  });

  test('returns the column number when a valid column is entered', async () => {
    const board: IBoard = [
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL]
    ];

    inputAdapter.ask.mockResolvedValueOnce('2');

    const column = await moveStrategy.createNextMove(board, new Player('Bob'));

    expect(column).toBe(1);
    expect(inputAdapter.ask).toHaveBeenCalledWith('It is Bob\'s turn.\nChoose column (1-3):');
  });

  test('displays error when input is invalid', async () => {
    const board: IBoard = [
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL]
    ];

    inputAdapter.ask.mockResolvedValueOnce('5');
    inputAdapter.ask.mockResolvedValueOnce('1');

    await moveStrategy.createNextMove(board, new Player('Bob'));

    expect(inputAdapter.ask).toHaveBeenCalledWith('It is Bob\'s turn.\nChoose column (1-3):');
    expect(outputAdapter.render).toHaveBeenCalledWith('Column 5 is full or invalid. Please choose another column.');
    expect(inputAdapter.ask).toHaveBeenCalledWith('It is Bob\'s turn.\nChoose column (1-3):');
  });
});
