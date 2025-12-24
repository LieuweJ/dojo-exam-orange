import { CliTicTacToeInputResolver } from '../../../../src/games/tic-tac-dojo/resolvers/cliInputResolver';
import { EMPTY_CELL, IBoard } from '../../../../src/core/model/boardState';

describe('CliTicTacToeInputResolver', () => {
  const TO_ROW_MAP = {
    a: 0,
    b: 1,
    c: 2,
  } as const;

  const resolver = new CliTicTacToeInputResolver(TO_ROW_MAP);

  const board: IBoard = [
    [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
  ];

  it('throws when userInput has an invalid length', () => {
    expect(() =>
      resolver.resolve({
        userInput: '',
        board,
      })
    ).toThrow(`Invalid userInput ''. Expected format like 'a1'.`);

    expect(() =>
      resolver.resolve({
        userInput: 'a12',
        board,
      })
    ).toThrow(`Invalid userInput 'a12'. Expected format like 'a1'.`);
  });

  it('throws when column is not a number', () => {
    expect(() =>
      resolver.resolve({
        userInput: 'ab',
        board,
      })
    ).toThrow(`Invalid column 'b'.`);
  });

  it('throws when position is outside board boundaries', () => {
    expect(() =>
      resolver.resolve({
        userInput: 'a4',
        board,
      })
    ).toThrow(`Position 'a4' is outside the board boundaries.`);

    expect(() =>
      resolver.resolve({
        userInput: 'c9',
        board,
      })
    ).toThrow(`Position 'c9' is outside the board boundaries.`);
  });

  it('returns a valid BoardPosition for correct input', () => {
    const position = resolver.resolve({
      userInput: 'b2',
      board,
    });

    expect(position).toEqual({
      row: 1,
      column: 1,
    });
  });
});
