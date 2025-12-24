import { BoardState, EMPTY_CELL } from '../../../src/core/model/boardState';
import { PIECE_O } from '../../../src/games/orange-in-a-row/composition/orangeInARowComposition';

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
