import { CHESS_PIECE_TYPES, ChessPiece } from '../../../src/games/scacchi-con-dojo/model/piece';
import { BoardState, EMPTY_CELL } from '../../../src/core/model/boardState';

describe('chess piece', () => {
  test('a chess piece can be placed on a board', () => {
    const pawn: ChessPiece = new ChessPiece(Symbol('pb-1'), CHESS_PIECE_TYPES.PAWN);
    const board = new BoardState([
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ]);

    board.addMove({
      position: { row: 1, column: 2 },
      piece: pawn,
    });

    const boardData = board.getBoard();
    expect(boardData[1][2]).toBe(pawn);
  });
});
