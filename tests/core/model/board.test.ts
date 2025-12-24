import { BoardPosition, BoardState, EMPTY_CELL } from '../../../src/core/model/boardState';
import { PIECE_O, PIECE_X } from '../../../src/composition/orangeInARowComposition';

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

  it('places a piece in the lowest empty row of a column', () => {
    board.addMove({ position: createBoardPosition(2), piece: PIECE_X });

    const state = board.getBoard();

    expect(state[3][2]).toBe(PIECE_X); // bottom row
  });

  it('stacks pieces in the same column', () => {
    board.addMove({ position: createBoardPosition(1), piece: PIECE_X });
    board.addMove({ position: createBoardPosition(1), piece: PIECE_O });

    const state = board.getBoard();

    expect(state[3][1]).toBe(PIECE_X);
    expect(state[2][1]).toBe(PIECE_O);
  });

  it('throws when adding a move to a full column', () => {
    for (let i = 0; i < 4; i++) {
      board.addMove({ position: createBoardPosition(2), piece: PIECE_X });
    }

    expect(() => {
      board.addMove({ position: createBoardPosition(2), piece: PIECE_O });
    }).toThrow('Cannot add move to column 2.');
  });

  it('throws when column is not on the board', () => {
    expect(() => {
      board.addMove({ position: createBoardPosition(99), piece: PIECE_O });
    }).toThrow('Cannot add move to column 99.');
  });
});

const createBoardPosition = (n: number): BoardPosition => {
  return {
    column: n,
  };
};
