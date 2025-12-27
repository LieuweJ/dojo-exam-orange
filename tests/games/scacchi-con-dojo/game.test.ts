import { ChessPiece } from '../../../src/games/scacchi-con-dojo/model/piece';
import { BoardState, EMPTY_CELL, IBoard } from '../../../src/core/model/boardState';
import { ChessMoveHandler } from '../../../src/games/scacchi-con-dojo/handler/ChessMoveHandler';
import { Move } from '../../../src/core/model/rules';

describe('chess piece', () => {
  test('the chess piece is represented on the board with value', () => {
    const pieceSymbol = Symbol('pw-1');

    const chessPiece: ChessPiece = new ChessPiece(pieceSymbol);

    expect(chessPiece.getBoardValue()).toBe(pieceSymbol);
  });

  test('a chess piece can move to an empty place on the board.', () => {
    const attackingPiece: ChessPiece = new ChessPiece(Symbol('attackingPiece'));

    const initBoard = new BoardState([
      [EMPTY_CELL, attackingPiece, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ]);

    const expectedBoardAfterMove: IBoard = [
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, attackingPiece, EMPTY_CELL],
    ];

    const moveMove: Move = {
      position: { row: 1, column: 1 },
      piece: attackingPiece,
    };

    const moveHandler = new ChessMoveHandler();

    moveHandler.handle(moveMove, initBoard);

    const boardAfterMove = initBoard.getBoard();
    expect(boardAfterMove).toStrictEqual(expectedBoardAfterMove);
  });
});
