import { CliMoveStrategy } from '../../src/strategy/player/cliMoveStrategy';
import { IInputAdapter } from '../../src/adapters/terminalInputAdapter';
import { EMPTY_CELL, IBoard, MARKER_X, PlayerBoardMarker } from '../../src/model/boardState';
import { InputOutputValidator } from '../../src/validators/inputOutputValidator';
import { IOutputAdapter } from '../../src/adapters/terminalOutputAdapter';

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

    moveStrategy = new CliMoveStrategy(inputAdapter, outputAdapter, new InputOutputValidator());
  });

  test('returns a move with the given marker when a valid column is entered', async () => {
    const givenMarker: PlayerBoardMarker = MARKER_X;
    const board: IBoard = [
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ];

    inputAdapter.ask.mockResolvedValueOnce('2');

    const move = await moveStrategy.createNextMove(board, givenMarker, 'Alice');

    expect(move).toStrictEqual({ column: 1, marker: givenMarker });
  });

  test('sends the the correct question to the user', async () => {
    const board: IBoard = [
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ];

    inputAdapter.ask.mockResolvedValueOnce('2');

    const move = await moveStrategy.createNextMove(board, MARKER_X, 'Bob');

    expect(move).toStrictEqual({ column: 1, marker: MARKER_X });
    expect(inputAdapter.ask).toHaveBeenCalledWith(
      "It is Bob's turn.\nChoose column (1-3) for ● : "
    );
  });

  test('displays error when input is invalid', async () => {
    const board: IBoard = [
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ];

    inputAdapter.ask.mockResolvedValueOnce('-5');
    inputAdapter.ask.mockResolvedValueOnce('1');

    await moveStrategy.createNextMove(board, MARKER_X, 'Bob');

    expect(inputAdapter.ask).toHaveBeenCalledTimes(2);
    expect(outputAdapter.render).toHaveBeenCalledWith(
      'Column -5 is invalid. Please choose another column.'
    );
  });
});
