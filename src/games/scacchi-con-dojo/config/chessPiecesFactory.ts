import { RelativeMovement } from '../model/chessPiece';

export type CastlingCapability = {
  canInitiate: boolean;
  canParticipate: boolean;
};

export type ChessPieceDefinition = {
  movement: ReadonlySet<RelativeMovement>;
  castling: CastlingCapability;
};

export const CHESS_PIECE_KIND = {
  KING: 'king',
  QUEEN: 'queen',
  ROOK: 'rook',
  BISHOP: 'bishop',
  KNIGHT: 'knight',
  PAWN: 'pawn',
} as const;

export type ChessPieceKind = (typeof CHESS_PIECE_KIND)[keyof typeof CHESS_PIECE_KIND];

export const CHESS_PIECE_DEFINITIONS: Record<ChessPieceKind, ChessPieceDefinition> = {
  king: {
    movement: new Set([
      { direction: [{ row: -1, column: 0 }], maxSteps: 1 },
      { direction: [{ row: 1, column: 0 }], maxSteps: 1 },
      { direction: [{ row: 0, column: -1 }], maxSteps: 1 },
      { direction: [{ row: 0, column: 1 }], maxSteps: 1 },
      { direction: [{ row: -1, column: -1 }], maxSteps: 1 },
      { direction: [{ row: -1, column: 1 }], maxSteps: 1 },
      { direction: [{ row: 1, column: -1 }], maxSteps: 1 },
      { direction: [{ row: 1, column: 1 }], maxSteps: 1 },
    ]),
    castling: {
      canInitiate: true,
      canParticipate: false,
    },
  },

  queen: {
    movement: new Set([
      { direction: [{ row: -1, column: 0 }], maxSteps: Infinity },
      { direction: [{ row: 1, column: 0 }], maxSteps: Infinity },
      { direction: [{ row: 0, column: -1 }], maxSteps: Infinity },
      { direction: [{ row: 0, column: 1 }], maxSteps: Infinity },
      { direction: [{ row: -1, column: -1 }], maxSteps: Infinity },
      { direction: [{ row: -1, column: 1 }], maxSteps: Infinity },
      { direction: [{ row: 1, column: -1 }], maxSteps: Infinity },
      { direction: [{ row: 1, column: 1 }], maxSteps: Infinity },
    ]),
    castling: {
      canInitiate: false,
      canParticipate: false,
    },
  },

  rook: {
    movement: new Set([
      { direction: [{ row: -1, column: 0 }], maxSteps: Infinity },
      { direction: [{ row: 1, column: 0 }], maxSteps: Infinity },
      { direction: [{ row: 0, column: -1 }], maxSteps: Infinity },
      { direction: [{ row: 0, column: 1 }], maxSteps: Infinity },
    ]),
    castling: {
      canInitiate: false,
      canParticipate: true,
    },
  },

  bishop: {
    movement: new Set([
      { direction: [{ row: -1, column: -1 }], maxSteps: Infinity },
      { direction: [{ row: -1, column: 1 }], maxSteps: Infinity },
      { direction: [{ row: 1, column: -1 }], maxSteps: Infinity },
      { direction: [{ row: 1, column: 1 }], maxSteps: Infinity },
    ]),
    castling: {
      canInitiate: false,
      canParticipate: false,
    },
  },

  knight: {
    movement: new Set([
      { direction: [{ row: -2, column: -1 }], maxSteps: 1 },
      { direction: [{ row: -2, column: 1 }], maxSteps: 1 },
      { direction: [{ row: -1, column: -2 }], maxSteps: 1 },
      { direction: [{ row: -1, column: 2 }], maxSteps: 1 },
      { direction: [{ row: 1, column: -2 }], maxSteps: 1 },
      { direction: [{ row: 1, column: 2 }], maxSteps: 1 },
      { direction: [{ row: 2, column: -1 }], maxSteps: 1 },
      { direction: [{ row: 2, column: 1 }], maxSteps: 1 },
    ]),
    castling: {
      canInitiate: false,
      canParticipate: false,
    },
  },

  pawn: {
    movement: new Set(), // pawn handled specially
    castling: {
      canInitiate: false,
      canParticipate: false,
    },
  },
} as const;
