import { BoardState, EMPTY_CELL } from '../../../../src/core/model/boardState';

import { IPiece } from '../../../../src/core/model/IPiece';
import { ChessPiecePawn } from '../../../../src/games/scacchi-con-dojo/model/chessPiecePawn';

// --- helpers ----------------------------------------------------

const createEmptyBoard = (rows = 8, columns = 8) =>
  Array.from({ length: rows }, () => Array.from({ length: columns }, () => EMPTY_CELL));

const otherTeamSymbol = Symbol('otherTeam');

const createOtherPiece = (): IPiece => {
  return new ChessPiecePawn(Symbol('P'), { row: -1, column: 0 }, otherTeamSymbol);
};

// --- tests ------------------------------------------------------

describe('ChessPiecePawn.canReachPosition (movement only)', () => {
  test('pawn can move one square forward on first move', () => {
    const board = createEmptyBoard();
    const pawn = new ChessPiecePawn(
      Symbol('P'),
      { row: -1, column: 0 }, // forward
      Symbol('white')
    );

    const boardState = new BoardState(board);
    boardState.addMove({
      piece: pawn,
      position: { row: 6, column: 4 },
    });

    expect(pawn.canReachPosition({ row: 5, column: 4 }, boardState)).toBe(true);
  });

  test('pawn can move two squares forward on first move', () => {
    const board = createEmptyBoard();
    const pawn = new ChessPiecePawn(Symbol('P'), { row: -1, column: 0 }, Symbol('white'));

    const boardState = new BoardState(board);
    boardState.addMove({
      piece: pawn,
      position: { row: 6, column: 4 },
    });

    expect(pawn.canReachPosition({ row: 4, column: 4 }, boardState)).toBe(true);
  });

  test('pawn is blocked by a piece directly in front', () => {
    const board = createEmptyBoard();
    const pawn = new ChessPiecePawn(Symbol('P'), { row: -1, column: 0 }, Symbol('white'));

    const blocker = createOtherPiece();

    const boardState = new BoardState(board);
    boardState.addMove({
      piece: pawn,
      position: { row: 6, column: 4 },
    });
    boardState.addMove({
      piece: blocker,
      position: { row: 5, column: 4 },
    });

    expect(pawn.canReachPosition({ row: 5, column: 4 }, boardState)).toBe(false);

    expect(pawn.canReachPosition({ row: 4, column: 4 }, boardState)).toBe(false);
  });

  test('pawn can only move one square forward after it has moved', () => {
    const board = createEmptyBoard();
    const pawn = new ChessPiecePawn(Symbol('P'), { row: -1, column: 0 }, Symbol('white'));

    const boardState = new BoardState(board);
    boardState.addMove({
      piece: pawn,
      position: { row: 6, column: 4 },
    });

    // simulate first move
    pawn.markMoved();

    expect(pawn.canReachPosition({ row: 5, column: 4 }, boardState)).toBe(true);

    expect(pawn.canReachPosition({ row: 4, column: 4 }, boardState)).toBe(false);
  });
});

describe('ChessPiecePawn.canReachPosition (attacking)', () => {
  test('pawn can attack diagonally if piece is attackable', () => {
    const board = createEmptyBoard();
    const enemy = createOtherPiece();

    const pawn = new ChessPiecePawn(Symbol('P'), { row: -1, column: 0 }, Symbol('white'));

    const boardState = new BoardState(board);
    boardState.addMove({
      piece: pawn,
      position: { row: 6, column: 4 },
    });
    boardState.addMove({
      piece: enemy,
      position: { row: 5, column: 5 },
    });

    expect(pawn.canReachPosition({ row: 5, column: 5 }, boardState)).toBe(true);
  });

  test('pawn cannot attack diagonally if square is empty', () => {
    const board = createEmptyBoard();

    const pawn = new ChessPiecePawn(Symbol('P'), { row: -1, column: 0 }, Symbol('white'));

    const boardState = new BoardState(board);
    boardState.addMove({
      piece: pawn,
      position: { row: 6, column: 4 },
    });

    expect(pawn.canReachPosition({ row: 5, column: 5 }, boardState)).toBe(false);
    expect(pawn.canReachPosition({ row: 5, column: 3 }, boardState)).toBe(false);
  });

  test('pawn cannot attack diagonally if piece is not attackable', () => {
    const board = createEmptyBoard();
    const friendly = createOtherPiece();

    const pawn = new ChessPiecePawn(Symbol('P'), { row: -1, column: 0 }, otherTeamSymbol);

    const boardState = new BoardState(board);
    boardState.addMove({
      piece: pawn,
      position: { row: 6, column: 4 },
    });
    boardState.addMove({
      piece: friendly,
      position: { row: 5, column: 5 },
    });

    expect(pawn.canReachPosition({ row: 5, column: 5 }, boardState)).toBe(false);
  });

  test('pawn cannot attack forward even if a piece is there', () => {
    const board = createEmptyBoard();
    const enemy = createOtherPiece();

    const pawn = new ChessPiecePawn(Symbol('P'), { row: -1, column: 0 }, Symbol('white'));

    const boardState = new BoardState(board);
    boardState.addMove({
      piece: pawn,
      position: { row: 6, column: 4 },
    });
    boardState.addMove({
      piece: enemy,
      position: { row: 5, column: 4 },
    });

    expect(pawn.canReachPosition({ row: 5, column: 4 }, boardState)).toBe(false);
  });

  test('canReachPosition returns false if the pawn is not on the board', () => {
    const board = createEmptyBoard();
    const pawn = new ChessPiecePawn(
      Symbol('P'),
      { row: -1, column: 0 }, // forward
      Symbol('white')
    );

    const boardState = new BoardState(board);

    expect(pawn.canReachPosition({ row: 0, column: 0 }, boardState)).toBe(false);
  });

  test('pawn cannot promote if it is not on the board', () => {
    const pawn = new ChessPiecePawn(
      Symbol('P1w'),
      { row: -1, column: 0 }, // white pawn
      Symbol('white')
    );

    const boardState = new BoardState([
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ]);

    // Even though row 0 is the promotion row for white,
    // the pawn is not on the board
    const canPromote = pawn.canPromote({ row: 0, column: 1 }, boardState);

    expect(canPromote).toBe(false);
  });
});
