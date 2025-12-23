import { BoardState, EMPTY_CELL, MARKER_O, MARKER_X } from '../../../src/core/model/boardState';

describe('Board.addMove', () => {
  let board: BoardState;

  beforeEach(() => {
    board = new BoardState([
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ]);
  });

  it('places a marker in the lowest empty row of a column', () => {
    board.addMove({ column: col(2), marker: MARKER_X });

    const state = board.getBoard();

    expect(state[3][2]).toBe(MARKER_X); // bottom row
  });

  it('stacks markers in the same column', () => {
    board.addMove({ column: col(1), marker: MARKER_X });
    board.addMove({ column: col(1), marker: MARKER_O });

    const state = board.getBoard();

    expect(state[3][1]).toBe(MARKER_X);
    expect(state[2][1]).toBe(MARKER_O);
  });

  it('throws when adding a move to a full column', () => {
    for (let i = 0; i < 4; i++) {
      board.addMove({ column: col(2), marker: MARKER_X });
    }

    expect(() => {
      board.addMove({ column: col(2), marker: MARKER_O });
    }).toThrow('Cannot add move to column 2.');
  });

  it('throws when column is not on the board', () => {
    expect(() => {
      board.addMove({ column: col(99), marker: MARKER_O });
    }).toThrow('Cannot add move to column 99.');
  });
});

export const col = (n: number) => n;
