import {
  BoardState,
  MARKER_X,
  MARKER_O,
  ColumnIndex,
  EMPTY_CELL,
} from '../../src/model/boardState';

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
    }).toThrow('Board column 2 is full or invalid.');
  });

  it('throws when column is not on the board', () => {
    expect(() => {
      board.addMove({ column: col(99), marker: MARKER_O });
    }).toThrow('Board column 99 is full or invalid.');
  });
});

export const col = (n: number) => n as ColumnIndex;
