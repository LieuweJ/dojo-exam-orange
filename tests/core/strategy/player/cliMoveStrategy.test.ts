import { CliMoveStrategy } from '../../../../src/core/strategy/player/cliMoveStrategy';
import { IInputAdapter } from '../../../../src/core/adapters/terminalInputAdapter';
import { EMPTY_CELL, IBoard } from '../../../../src/core/model/boardState';
import { IOutputAdapter } from '../../../../src/core/adapters/terminalOutputAdapter';

import {
  ORANGE_IN_A_ROW_BOARD_UI,
  PIECE_X,
} from '../../../../src/composition/orangeInARowComposition';
import { Piece } from '../../../../src/core/model/player';

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

    moveStrategy = new CliMoveStrategy(inputAdapter, outputAdapter, ORANGE_IN_A_ROW_BOARD_UI);
  });

  test('returns a move with the given piece when a valid column is entered', async () => {
    const givenPiece: Piece = PIECE_X;
    const board: IBoard = [
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ];

    inputAdapter.ask.mockResolvedValueOnce('2');

    const move = await moveStrategy.createNextMove(board, [givenPiece], 'Alice');

    expect(move).toStrictEqual({ position: { column: 1 }, piece: givenPiece });
  });

  test('sends the the correct question to the user', async () => {
    const board: IBoard = [
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ];

    inputAdapter.ask.mockResolvedValueOnce('2');

    const move = await moveStrategy.createNextMove(board, [PIECE_X], 'Bob');

    expect(move).toStrictEqual({ position: { column: 1 }, piece: PIECE_X });
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

    await moveStrategy.createNextMove(board, [PIECE_X], 'Bob');

    expect(inputAdapter.ask).toHaveBeenCalledTimes(2);
    expect(outputAdapter.render).toHaveBeenCalledWith(
      'Column -5 is invalid. Please choose another column.'
    );
  });
});
