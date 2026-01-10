// --- helpers ----------------------------------------------------

import { BoardPosition, BoardState, EMPTY_CELL } from '../../../../src/core/model/boardState';
import {
  ChessPiece,
  RelativeMovement,
} from '../../../../src/games/scacchi-con-dojo/model/chessPiece';
import { IPiece } from '../../../../src/core/model/IPiece';
import {
  ChessPieceFactory,
  CreateChessPieceInput,
} from '../../../../src/games/scacchi-con-dojo/factory/chessPieceFactory';
import { CHESS_PIECE_KIND } from '../../../../src/games/scacchi-con-dojo/config/chessPiecesConfig';
import { ChessPiecePawn } from '../../../../src/games/scacchi-con-dojo/model/chessPiecePawn';

const createEmptyBoard = (rows = 8, columns = 8) =>
  Array.from({ length: rows }, () => Array.from({ length: columns }, () => EMPTY_CELL));

const pieceFactory = new ChessPieceFactory();
const createStaticChessPiece = (symbol = Symbol('static')): ChessPiece =>
  new ChessPiece(symbol, CHESS_PIECE_KIND.BISHOP, new Set(), Symbol('static_team'));

const createKing = () =>
  pieceFactory.create({
    team: Symbol('white'),
    kind: 'king',
    index: 1,
  });

const createCastlingRook = () =>
  pieceFactory.create({
    team: Symbol('white'),
    kind: 'rook',
    index: 1,
  });

const createTestRook = () =>
  pieceFactory.create({
    team: Symbol('white'),
    kind: 'rook',
    index: 1,
  });

type BlockingReachabilityTestCase = {
  name: string;
  from: BoardPosition;
  blocker: {
    piece: IPiece;
    position: BoardPosition;
  };
  reachable: BoardPosition[];
  unreachable: BoardPosition[];
};

const otherPieceOtherTeam = createStaticChessPiece();
const pieceUnderTest = createTestRook();
const otherPieceSameTeam = pieceFactory.createFrom(pieceUnderTest, CHESS_PIECE_KIND.BISHOP, 2);

const cases: BlockingReachabilityTestCase[] = [
  {
    name: 'Rook can capture attackable piece but not move beyond',
    from: { row: 4, column: 4 },
    blocker: {
      piece: otherPieceOtherTeam,
      position: { row: 6, column: 4 },
    },
    reachable: [
      { row: 5, column: 4 },
      { row: 6, column: 4 }, // capture square
    ],
    unreachable: [
      { row: 7, column: 4 }, // beyond capture
    ],
  },
  {
    name: 'Rook is blocked by non-attackable piece',
    from: { row: 4, column: 4 },
    blocker: {
      piece: otherPieceSameTeam,
      position: { row: 6, column: 4 },
    },
    reachable: [
      { row: 5, column: 4 }, // last square before blocker
    ],
    unreachable: [
      { row: 6, column: 4 }, // blocker itself
      { row: 7, column: 4 }, // beyond blocker
    ],
  },
];

// --- tests ------------------------------------------------------

describe('ChessPiece.canReachPosition (blocking & capture)', () => {
  test.each(cases)(
    '$name',
    ({ from, blocker, reachable, unreachable }: BlockingReachabilityTestCase) => {
      const board = createEmptyBoard();
      const boardState = new BoardState(board);

      boardState.addMove({
        piece: pieceUnderTest,
        position: from,
      });

      boardState.addMove({
        piece: blocker.piece,
        position: blocker.position,
      });

      for (const target of reachable) {
        expect(pieceUnderTest.canReachPosition(target, boardState)).toBe(true);
      }

      for (const target of unreachable) {
        expect(pieceUnderTest.canReachPosition(target, boardState)).toBe(false);
      }
    }
  );

  test('hasMoved reflects whether markMoved was called', () => {
    const piece = createStaticChessPiece(Symbol('movedPiece'));

    expect(piece.hasMoved()).toBe(false);

    piece.markMoved();

    expect(piece.hasMoved()).toBe(true);
  });

  test('canReachPosition returns false if the piece is not on the board', () => {
    const board = createEmptyBoard();
    const piece = createStaticChessPiece(Symbol('orphan'));

    const boardState = new BoardState(board);

    expect(piece.canReachPosition({ row: 0, column: 0 }, boardState)).toBe(false);
  });

  describe('ChessPiece.canReachPosition (castling reachability)', () => {
    test('king can reach king-side castling square when rook is available', () => {
      const board = createEmptyBoard();
      const king = createKing();
      const rook = createCastlingRook();

      const boardState = new BoardState(board);

      // standard white setup row
      boardState.addMove({ piece: king, position: { row: 7, column: 4 } });
      boardState.addMove({ piece: rook, position: { row: 7, column: 7 } });

      // king-side castling target
      expect(king.canReachPosition({ row: 7, column: 6 }, boardState)).toBe(true);
    });

    test('king can reach queen-side castling square when rook is available', () => {
      const board = createEmptyBoard();
      const king = createKing();
      const rook = createCastlingRook();

      const boardState = new BoardState(board);

      boardState.addMove({ piece: king, position: { row: 7, column: 4 } });
      boardState.addMove({ piece: rook, position: { row: 7, column: 0 } });

      // queen-side castling target
      expect(king.canReachPosition({ row: 7, column: 2 }, boardState)).toBe(true);
    });

    test('king cannot castle if it has already moved', () => {
      const board = createEmptyBoard();
      const king = createKing();
      const rook = createCastlingRook();

      const boardState = new BoardState(board);

      boardState.addMove({ piece: king, position: { row: 7, column: 4 } });
      boardState.addMove({ piece: rook, position: { row: 7, column: 7 } });

      king.markMoved();

      expect(king.canReachPosition({ row: 7, column: 6 }, boardState)).toBe(false);
    });

    test('king cannot castle if the rook has already moved', () => {
      const board = createEmptyBoard();
      const king = createKing();
      const rook = createCastlingRook();

      const boardState = new BoardState(board);

      boardState.addMove({ piece: king, position: { row: 7, column: 4 } });
      boardState.addMove({ piece: rook, position: { row: 7, column: 7 } });

      rook.markMoved();

      expect(king.canReachPosition({ row: 7, column: 6 }, boardState)).toBe(false);
    });

    test('king cannot castle if there is no rook on the board edge', () => {
      const board = createEmptyBoard();
      const king = createKing();

      const boardState = new BoardState(board);

      boardState.addMove({ piece: king, position: { row: 7, column: 4 } });

      expect(king.canReachPosition({ row: 7, column: 6 }, boardState)).toBe(false);

      expect(king.canReachPosition({ row: 7, column: 2 }, boardState)).toBe(false);
    });

    test('castling returns false if king is not on the board', () => {
      const board = createEmptyBoard();
      const king = createKing(); // not added to board

      const boardState = new BoardState(board);

      expect(king.canReachPosition({ row: 7, column: 6 }, boardState)).toBe(false);
    });

    test('king cannot castle to a different row', () => {
      const board = createEmptyBoard();
      const king = createKing();
      const rook = createCastlingRook();

      const boardState = new BoardState(board);

      boardState.addMove({ piece: king, position: { row: 7, column: 4 } });
      boardState.addMove({ piece: rook, position: { row: 7, column: 7 } });

      // same column delta, wrong row
      expect(king.canReachPosition({ row: 6, column: 6 }, boardState)).toBe(false);
    });

    test('king cannot castle if there are pieces between the king and the rook', () => {
      const board = createEmptyBoard();
      const king = createKing();
      const rook = createCastlingRook();
      const blocker = createStaticChessPiece(Symbol('blocker'));

      const boardState = new BoardState(board);

      boardState.addMove({ piece: king, position: { row: 7, column: 4 } });
      boardState.addMove({ piece: rook, position: { row: 7, column: 7 } });
      boardState.addMove({ piece: blocker, position: { row: 7, column: 5 } }); // between king & rook

      expect(king.canReachPosition({ row: 7, column: 6 }, boardState)).toBe(false);
    });

    test('king cannot castle unless it moves exactly two squares horizontally', () => {
      const board = createEmptyBoard();
      const king = createKing();
      const rook = createCastlingRook();

      const boardState = new BoardState(board);

      boardState.addMove({ piece: king, position: { row: 7, column: 4 } });
      boardState.addMove({ piece: rook, position: { row: 7, column: 7 } });

      // castling square
      expect(king.canReachPosition({ row: 7, column: 6 }, boardState)).toBe(true);

      // not a castling square, but still reachable normally
      expect(king.canReachPosition({ row: 7, column: 5 }, boardState)).toBe(true);

      // not a castling square, not reachable
      expect(king.canReachPosition({ row: 7, column: 4 }, boardState)).toBe(false);
    });

    test('returns false if the piece is not on the board', () => {
      const e = EMPTY_CELL;

      const king = createKing();
      const boardState = new BoardState([
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
      ]);

      expect(king.isCastlingDestination({ row: 7, column: 6 }, boardState)).toBe(false);
    });
  });

  describe('ChessPieceFactory ', () => {
    test('chess piece factory will throw if pawn is created with create method', () => {
      const factory = new ChessPieceFactory();

      expect(() => {
        factory.create({
          team: Symbol('white'),
          kind: CHESS_PIECE_KIND.PAWN as unknown as CreateChessPieceInput['kind'],
          index: 1,
        });
      }).toThrow('Pawn kind is not allowed in this method.');
    });

    test('throws when attempting to create pawn from non-pawn source', () => {
      const factory = new ChessPieceFactory();

      const rook = factory.create({
        team: Symbol('white'),
        kind: CHESS_PIECE_KIND.ROOK,
        index: 1,
      });
      expect(() => factory.createFrom(rook, CHESS_PIECE_KIND.PAWN, 1)).toThrow(
        'Cannot promote non-pawn into pawn.'
      );
    });

    test('creates pawn from pawn source (sanity check)', () => {
      const factory = new ChessPieceFactory();

      const pawn = factory.createPawn({
        team: Symbol('white'),
        index: 1,
        forwardDirection: { row: -1, column: 0 },
      });

      const newPawn = factory.createFrom(pawn, CHESS_PIECE_KIND.PAWN, 2);

      if (!(newPawn instanceof ChessPiecePawn)) {
        throw new Error('Expected newPawn to be an instance of ChessPiecePawn');
      }

      expect(newPawn).toBeInstanceOf(ChessPiecePawn);
      expect(newPawn.getForwardDirection()).toEqual(pawn.getForwardDirection());
      expect(newPawn.getBoardValue().description).toContain('P2w');
    });
  });

  describe('ChessPiece.clone', () => {
    it('creates a new instance with identical state', () => {
      const teamWhite = Symbol('white');
      const movement: RelativeMovement = {
        direction: [{ row: 0, column: 1 }],
        maxSteps: 7,
      };

      const piece = new ChessPiece(
        Symbol('R1'),
        CHESS_PIECE_KIND.ROOK,
        new Set([movement]),
        teamWhite,
        false,
        true
      );

      piece.markMoved();

      const cloned = piece.clone();

      // different instance
      expect(cloned).not.toBe(piece);

      // same immutable identity
      expect(cloned.getBoardValue()).toBe(piece.getBoardValue());

      // state is preserved
      expect(cloned.hasMoved()).toBe(true);
      expect(cloned.getKind()).toBe(piece.getKind());
      expect(cloned.getTeam()).toBe(piece.getTeam());

      // castling flags preserved
      expect(cloned.canInitiateCastling()).toBe(piece.canInitiateCastling());
      expect(cloned.canParticipateInCastling()).toBe(piece.canParticipateInCastling());
    });

    it('does not share moved state between original and clone', () => {
      const teamBlack = Symbol('black');
      const piece = new ChessPiece(Symbol('N1'), CHESS_PIECE_KIND.KNIGHT, new Set(), teamBlack);

      const cloned = piece.clone();

      cloned.markMoved();

      expect(piece.hasMoved()).toBe(false);
      expect(cloned.hasMoved()).toBe(true);
    });
  });

  describe('ChessPiece.getAllReachablePositions', () => {
    it('returns an empty array when the piece is not on the board', () => {
      const factory = new ChessPieceFactory();

      const piece = factory.create({
        team: Symbol('white'),
        kind: CHESS_PIECE_KIND.BISHOP,
        index: 1,
      });

      // Board does NOT contain the piece
      const board = new BoardState([
        [EMPTY_CELL, EMPTY_CELL],
        [EMPTY_CELL, EMPTY_CELL],
      ]);

      const result = piece.getAllReachablePositions(board);

      expect(result).toEqual([]);
    });
  });
});
