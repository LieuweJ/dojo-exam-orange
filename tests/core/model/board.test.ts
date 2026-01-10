import { BoardState, EMPTY_CELL } from '../../../src/core/model/boardState';
import { PIECE_O } from '../../../src/games/orange-in-a-row/composition/orangeInARowComposition';
import { CoinPiece } from '../../../src/sharedMechanics/connectLineGame/model/coinPiece';

describe('Board.addMove', () => {
  let board: BoardState;

  beforeEach(() => {
    board = new BoardState([
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ]);
  });

  it('throws when column is not on the board', () => {
    expect(() => {
      board.addMove({
        position: {
          column: 99,
          row: 0,
        },
        piece: PIECE_O,
      });
    }).toThrow('Cannot add boardPosition: {row: 0, column: 99} to the board.');
  });

  it('throws when row is not on the board', () => {
    expect(() => {
      board.addMove({
        position: {
          column: 1,
          row: -99,
        },
        piece: PIECE_O,
      });
    }).toThrow('Cannot add boardPosition: {row: -99, column: 1} to the board.');
  });
});

describe('BoardState.clone', () => {
  it('clones board and pieces without shared references', () => {
    const coinA = new CoinPiece(Symbol('A'));
    const coinB = new CoinPiece(Symbol('B'));

    const board = new BoardState([
      [coinA, EMPTY_CELL],
      [EMPTY_CELL, coinB],
    ]);

    const cloned = board.clone();

    expect(cloned).not.toBe(board);
    expect(cloned.getBoard()).toHaveLength(2);

    const clonedA = cloned.getBoardCellAt({ row: 0, column: 0 });
    const clonedB = cloned.getBoardCellAt({ row: 1, column: 1 });

    expect(clonedA).not.toBe(coinA);
    expect(clonedB).not.toBe(coinB);

    expect(clonedA.getBoardValue()).toBe(coinA.getBoardValue());
    expect(clonedB.getBoardValue()).toBe(coinB.getBoardValue());
  });
});
