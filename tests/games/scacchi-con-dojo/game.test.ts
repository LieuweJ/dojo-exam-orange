import { ChessPiece } from '../../../src/games/scacchi-con-dojo/model/chessPiece';
import { BoardState, EMPTY_CELL, IBoard } from '../../../src/core/model/boardState';
import { ChessMoveHandler } from '../../../src/games/scacchi-con-dojo/handler/ChessMoveHandler';
import { Move } from '../../../src/core/model/rules';
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

describe('chess piece', () => {
  test('the chess piece is represented on the board with value', () => {
    const piece = createTestPiece({ team: 'white', kind: CHESS_PIECE_KIND.ROOK, index: 1 });

    expect(piece.getBoardValue().toString()).toContain('R1w');
  });

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

    const move: Move = {
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

    const move: Move = {
      position: { row: 0, column: 1 },
      piece: pieceNotOnBoard,
    };

    const moveHandler = new ChessMoveHandler();

    await expect(moveHandler.handle(move, initBoard)).rejects.toThrow(
      `The chess piece ${String(pieceNotOnBoard.getBoardValue())} is not present on the board. Chess piece cannot be moved.`
    );
  });
});
