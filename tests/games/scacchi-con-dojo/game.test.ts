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
    const piece: ChessPiece = new ChessPiece(Symbol('attackingPiece'));

    const initBoard = new BoardState([
      [EMPTY_CELL, piece, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ]);

    const expectedBoardAfterMove: IBoard = [
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, piece, EMPTY_CELL],
    ];

    const move: Move = {
      position: { row: 1, column: 1 },
      piece: piece,
    };

    const moveHandler = new ChessMoveHandler();

    moveHandler.handle(move, initBoard);

    const boardAfterMove = initBoard.getBoard();
    expect(boardAfterMove).toStrictEqual(expectedBoardAfterMove);
  });

  test('a chess piece can move to a place on the board which is already occupied.', () => {
    const attackingPiece: ChessPiece = new ChessPiece(Symbol('attackingPiece'));
    const defendingPiece: ChessPiece = new ChessPiece(Symbol('defendingPiece'));

    const initBoard = new BoardState([
      [EMPTY_CELL, attackingPiece, EMPTY_CELL],
      [EMPTY_CELL, defendingPiece, EMPTY_CELL],
    ]);

    const expectedBoardAfterMove: IBoard = [
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, attackingPiece, EMPTY_CELL],
    ];

    const move: Move = {
      position: { row: 1, column: 1 },
      piece: attackingPiece,
    };

    const moveHandler = new ChessMoveHandler();

    moveHandler.handle(move, initBoard);

    const boardAfterMove = initBoard.getBoard();
    expect(boardAfterMove).toStrictEqual(expectedBoardAfterMove);
  });

  test('a chess piece cannot be moved if the move.piece is not already on the board.', async () => {
    const pieceNotOnBoard: ChessPiece = new ChessPiece(Symbol('notPlacedPiece'));

    const initBoard = new BoardState([
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ]);

    const move: Move = {
      position: { row: 0, column: 1 },
      piece: pieceNotOnBoard,
    };

    const moveHandler = new ChessMoveHandler();

    await expect(moveHandler.handle(move, initBoard)).rejects.toThrow(
      'The chess piece Symbol(notPlacedPiece) is not present on the board. Chess piece cannot be moved.'
    );
  });
});
