// --- helpers ----------------------------------------------------

import { BoardPosition, BoardState, EMPTY_CELL } from '../../../../src/core/model/boardState';
import { ChessPiece } from '../../../../src/games/scacchi-con-dojo/model/chessPiece';
import { IPiece } from '../../../../src/core/model/IPiece';
import {
  ChessPieceFactory,
  CreateChessPieceInput,
} from '../../../../src/games/scacchi-con-dojo/factory/chessPieceSetFactory';
import { CHESS_PIECE_KIND } from '../../../../src/games/scacchi-con-dojo/config/chessPiecesFactory';
import { ChessPiecePawn } from '../../../../src/games/scacchi-con-dojo/model/chessPiecePawn';

const createEmptyBoard = (rows = 8, columns = 8) =>
  Array.from({ length: rows }, () => Array.from({ length: columns }, () => EMPTY_CELL));

const pieceFactory = new ChessPieceFactory();
const createStaticChessPiece = (symbol = Symbol('static')): ChessPiece =>
  new ChessPiece(symbol, CHESS_PIECE_KIND.BISHOP, new Set(), new Set<IPiece>());

const createKing = () =>
  pieceFactory.create({
    team: 'white',
    kind: 'king',
    index: 1,
  });

const createCastlingRook = () =>
  pieceFactory.create({
    team: 'white',
    kind: 'rook',
    index: 1,
  });

const createTestRook = (attackablePieces: Set<IPiece>) =>
  pieceFactory.create({
    team: 'white',
    kind: 'rook',
    index: 1,
    attackablePieces,
  });

// --- test-side composition root --------------------------------

// This will grow later with:
// - isFirstMoveDone
// - canCastle
// - enPassantTarget
// etc.
type PieceTestContext = {
  attackablePieces: Set<IPiece>;
};

// --- test cases -------------------------------------------------

type BlockingReachabilityTestCase = {
  name: string;
  from: BoardPosition;
  context: PieceTestContext;

  blocker: {
    piece: IPiece;
    position: BoardPosition;
  };

  reachable: BoardPosition[];
  unreachable: BoardPosition[];
};

const otherPiece = createStaticChessPiece();

const cases: BlockingReachabilityTestCase[] = [
  {
    name: 'Rook can capture attackable piece but not move beyond',
    from: { row: 4, column: 4 },
    context: {
      attackablePieces: new Set([otherPiece]),
    },
    blocker: {
      piece: otherPiece,
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
    context: {
      attackablePieces: new Set(), // nothing is attackable
    },
    blocker: {
      piece: otherPiece,
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
    ({ from, context, blocker, reachable, unreachable }: BlockingReachabilityTestCase) => {
      const board = createEmptyBoard();
      const piece = createTestRook(context.attackablePieces);

      const boardState = new BoardState(board);

      boardState.addMove({
        piece,
        position: from,
      });

      boardState.addMove({
        piece: blocker.piece,
        position: blocker.position,
      });

      for (const target of reachable) {
        expect(piece.canReachPosition(target, boardState)).toBe(true);
      }

      for (const target of unreachable) {
        expect(piece.canReachPosition(target, boardState)).toBe(false);
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
        pieceFactory.create({
          team: 'white',
          kind: CHESS_PIECE_KIND.PAWN as unknown as CreateChessPieceInput['kind'],
          index: 1,
        });
      }).toThrow('Pawn kind is not allowed in this method.');
    });

    test('throws if team cannot be inferred from source piece', () => {
      const factory = new ChessPieceFactory();

      // Create a piece with a malformed boardValue symbol
      const badPiece = new ChessPiece(
        Symbol(), // no trailing team char
        CHESS_PIECE_KIND.ROOK,
        new Set(),
        new Set(),
        false,
        false
      );

      expect(() => factory.createFrom(badPiece, CHESS_PIECE_KIND.QUEEN, 1)).toThrow(
        'Cannot infer team from source piece.'
      );
    });

    test('throws when attempting to create pawn from non-pawn source', () => {
      const factory = new ChessPieceFactory();

      const rook = factory.create({
        team: 'white',
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
        team: 'white',
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
});
