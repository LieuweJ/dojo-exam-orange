import { PositionToTicTacToeCliResolver } from '../../../../src/games/tic-tac-dojo/resolvers/positionToTicTacDojoCliResolver';
import { BoardPosition } from '../../../../src/core/model/boardState';

describe('PositionToTicTacToeCliResolver', () => {
  const ROW_TO_STRING = {
    0: 'a',
    1: 'b',
    2: 'c',
  } as const;

  const resolver = new PositionToTicTacToeCliResolver(ROW_TO_STRING);

  it('resolves top-left position correctly', () => {
    const position: BoardPosition = { row: 0, column: 0 };

    const result = resolver.resolve(position);

    expect(result).toBe('a1');
  });

  it('resolves middle position correctly', () => {
    const position: BoardPosition = { row: 1, column: 1 };

    const result = resolver.resolve(position);

    expect(result).toBe('b2');
  });

  it('resolves bottom-right position correctly', () => {
    const position: BoardPosition = { row: 2, column: 2 };

    const result = resolver.resolve(position);

    expect(result).toBe('c3');
  });

  it('increments column index by one for display', () => {
    const position: BoardPosition = { row: 0, column: 2 };

    const result = resolver.resolve(position);

    expect(result).toBe('a3');
  });
});
