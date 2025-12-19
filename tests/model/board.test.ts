import { Board, MARKER_X, MARKER_O, ColumnIndex } from '../../src/model/board';

describe('Board.addMove', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board();
  });

  it('places a marker in the lowest empty row of a column', () => {
    board.addMove({ column: col(3), marker: MARKER_X });

    const state = board.getBoard();

    expect(state[5][3]).toBe(MARKER_X); // bottom row
  });

  it('stacks markers in the same column', () => {
    board.addMove({ column: col(3), marker: MARKER_X });
    board.addMove({ column: col(3), marker: MARKER_O });

    const state = board.getBoard();

    expect(state[5][3]).toBe(MARKER_X);
    expect(state[4][3]).toBe(MARKER_O);
  });

  it('throws when adding a move to a full column', () => {
    for (let i = 0; i < 6; i++) {
      board.addMove({ column: col(3), marker: MARKER_X });
    }

    expect(() => {
      board.addMove({ column: col(3), marker: MARKER_O });
    }).toThrow('Board column 3 is full or invalid.');
  });

  it('throws when column is not on the board', () => {
    expect(() => {
      board.addMove({ column: col(99), marker: MARKER_O });
    }).toThrow('Board column 99 is full or invalid.');
  });
});

export const col = (n: number) => n as ColumnIndex;