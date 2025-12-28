import { ChessPiece } from '../../../src/games/scacchi-con-dojo/model/chessPiece';
import { BoardState, EMPTY_CELL, IBoard } from '../../../src/core/model/boardState';
import {
  ChessMove,
  ChessMoveHandler,
} from '../../../src/games/scacchi-con-dojo/handler/ChessMoveHandler';
import { IPiece } from '../../../src/core/model/IPiece';
import { ChessPieceFactory } from '../../../src/games/scacchi-con-dojo/factory/chessPieceSetFactory';
import {
  CHESS_PIECE_KIND,
  ChessPieceKind,
} from '../../../src/games/scacchi-con-dojo/config/chessPiecesFactory';

const pieceFactory = new ChessPieceFactory();

const createTestPiece = (overrides?: {
  team?: string;
  kind?: ChessPieceKind;
  index?: number;
  attackablePieces?: Set<IPiece>;
}) =>
  pieceFactory.create({
    team: overrides?.team || '',
    kind: overrides?.kind ?? CHESS_PIECE_KIND.BISHOP,
    index: overrides?.index ?? 1,
    attackablePieces: overrides?.attackablePieces ?? new Set(),
  });

describe('chess piece can be moved on the board', () => {
  test('a chess piece can move to an empty place on the board.', () => {
    const piece: ChessPiece = createTestPiece({
      team: 'white',
      kind: CHESS_PIECE_KIND.ROOK,
      index: 1,
    });

    const initBoard = new BoardState([
      [EMPTY_CELL, piece, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ]);

    const expectedBoardAfterMove: IBoard = [
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, piece, EMPTY_CELL],
    ];

    const move: ChessMove = {
      position: { row: 1, column: 1 },
      piece: piece,
    };

    const moveHandler = new ChessMoveHandler();

    moveHandler.handle(move, initBoard);

    const boardAfterMove = initBoard.getBoard();
    expect(boardAfterMove).toStrictEqual(expectedBoardAfterMove);
  });

  test('a chess piece can move to a place on the board which is already occupied.', () => {
    const attackingPiece = createTestPiece({ index: 1 });
    const defendingPiece = createTestPiece({ index: 2 });

    const initBoard = new BoardState([
      [EMPTY_CELL, attackingPiece, EMPTY_CELL],
      [EMPTY_CELL, defendingPiece, EMPTY_CELL],
    ]);

    const expectedBoardAfterMove: IBoard = [
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, attackingPiece, EMPTY_CELL],
    ];

    const move: ChessMove = {
      position: { row: 1, column: 1 },
      piece: attackingPiece,
    };

    const moveHandler = new ChessMoveHandler();

    moveHandler.handle(move, initBoard);

    const boardAfterMove = initBoard.getBoard();
    expect(boardAfterMove).toStrictEqual(expectedBoardAfterMove);
  });

  test('Throws when the chess piece we want to move is not already on the board.', async () => {
    const pieceNotOnBoard = createTestPiece({ index: 99 });

    const initBoard = new BoardState([
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ]);

    const move: ChessMove = {
      position: { row: 0, column: 1 },
      piece: pieceNotOnBoard,
    };

    const moveHandler = new ChessMoveHandler();

    await expect(moveHandler.handle(move, initBoard)).rejects.toThrow(
      `The chess piece ${String(pieceNotOnBoard.getBoardValue())} is not present on the board. Chess piece cannot be moved.`
    );
  });

  test('king-side castling moves both king and rook correctly', async () => {
    const king = createTestPiece({
      team: 'white',
      kind: CHESS_PIECE_KIND.KING,
      index: 1,
    });

    const rook = createTestPiece({
      team: 'white',
      kind: CHESS_PIECE_KIND.ROOK,
      index: 1,
    });

    const e = EMPTY_CELL;

    const boardState = new BoardState([
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, king, e, e, rook],
    ]);

    const move: ChessMove = {
      piece: king,
      position: { row: 7, column: 6 }, // king-side castling
    };

    const moveHandler = new ChessMoveHandler();

    await moveHandler.handle(move, boardState);

    const board = boardState.getBoard();

    // King moved to g1
    expect(board[7][6]).toBe(king);

    // Rook moved to f1
    expect(board[7][5]).toBe(rook);

    // Original squares cleared
    expect(board[7][4]).toBe(EMPTY_CELL);
    expect(board[7][7]).toBe(EMPTY_CELL);

    // Both pieces marked as moved
    expect(king.hasMoved()).toBe(true);
    expect(rook.hasMoved()).toBe(true);
  });
  test('queen-side castling moves both king and rook correctly', async () => {
    const e = EMPTY_CELL;

    const king = createTestPiece({
      team: 'white',
      kind: CHESS_PIECE_KIND.KING,
      index: 1,
    });

    const rook = createTestPiece({
      team: 'white',
      kind: CHESS_PIECE_KIND.ROOK,
      index: 1,
    });

    const boardState = new BoardState([
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [rook, e, e, e, king, e, e, e],
    ]);

    const move: ChessMove = {
      piece: king,
      position: { row: 7, column: 2 }, // c1
    };

    const moveHandler = new ChessMoveHandler();
    await moveHandler.handle(move, boardState);

    const board = boardState.getBoard();

    // King → c1
    expect(board[7][2]).toBe(king);

    // Rook → d1
    expect(board[7][3]).toBe(rook);

    // Old squares cleared
    expect(board[7][4]).toBe(e);
    expect(board[7][0]).toBe(e);

    expect(king.hasMoved()).toBe(true);
    expect(rook.hasMoved()).toBe(true);
  });

  test('throws when castling rook is not found where expected', async () => {
    const e = EMPTY_CELL;

    const king = createTestPiece({
      team: 'white',
      kind: CHESS_PIECE_KIND.KING,
      index: 1,
    });

    // Important: NO rook on the board edge
    const boardState = new BoardState([
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, king, e, e, e], // King on e1, rook missing on h1
    ]);

    const move: ChessMove = {
      piece: king,
      position: { row: 7, column: 6 }, // g1 → king-side castling attempt
    };

    const moveHandler = new ChessMoveHandler();

    await expect(moveHandler.handle(move, boardState)).rejects.toThrow(
      'Castling rook not found where expected.'
    );
  });
});
