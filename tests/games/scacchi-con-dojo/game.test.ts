import { ChessPiece } from '../../../src/games/scacchi-con-dojo/model/piece';
import { BoardState, EMPTY_CELL } from '../../../src/core/model/boardState';

describe('chess piece', () => {
  test('the chess piece is represented on the board with value', () => {
    const pieceSymbol = Symbol('pw-1');

    const chessPiece: ChessPiece = new ChessPiece(pieceSymbol);

    expect(chessPiece.getBoardValue()).toBe(pieceSymbol);
  });

  test('a chess piece can be placed on a board', () => {
    const pawn: ChessPiece = new ChessPiece(Symbol('pb-1'));
    const board = new BoardState([
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ]);

    board.addMove({
      position: { row: 1, column: 2 },
      piece: pawn,
    });

    const boardData = board.getBoard();
    expect(boardData[1][2]).toStrictEqual(pawn);
  });
});
