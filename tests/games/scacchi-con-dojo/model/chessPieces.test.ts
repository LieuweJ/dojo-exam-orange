// --- helpers ----------------------------------------------------

import { BoardPosition, BoardState, EMPTY_CELL } from '../../../../src/core/model/boardState';
import { ChessPiece } from '../../../../src/games/scacchi-con-dojo/model/piece';
import { ROOK_MOVEMENT } from '../../../../src/games/scacchi-con-dojo/config/chessPiecesFactory';
import { IPiece } from '../../../../src/core/model/IPiece';

const createEmptyBoard = (rows = 8, columns = 8) =>
  Array.from({ length: rows }, () => Array.from({ length: columns }, () => EMPTY_CELL));

// Simple dummy piece for blocking / attacking
const createDummyPiece = (symbol = Symbol('X')): IPiece => ({
  getBoardValue: () => symbol,
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

const createRook = (ctx: PieceTestContext) =>
  new ChessPiece(Symbol('R'), ROOK_MOVEMENT, ctx.attackablePieces);

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

const otherPiece = createDummyPiece();

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
      const piece = createRook(context);

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
});
