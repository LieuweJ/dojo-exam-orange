import { CHESS_PIECE_KIND, ChessPieceKind } from '../config/chessPiecesConfig';
import { Team } from '../../../core/model/team';

/* ──────────────────────────────────────────────────────────
 * Domain teams (identity)
 * ────────────────────────────────────────────────────────── */

export const TEAM_WHITE: Team = Symbol('white');
export const TEAM_BLACK: Team = Symbol('black');

/* ──────────────────────────────────────────────────────────
 * Piece UI configuration
 * ────────────────────────────────────────────────────────── */

export type ChessPieceUi = Map<Team, string>;

export const CHESS_PIECE_UI = new Map<ChessPieceKind, ChessPieceUi>([
  [
    CHESS_PIECE_KIND.KING,
    new Map<Team, string>([
      [TEAM_WHITE, '♔'],
      [TEAM_BLACK, '♚'],
    ]),
  ],
  [
    CHESS_PIECE_KIND.QUEEN,
    new Map<Team, string>([
      [TEAM_WHITE, '♕'],
      [TEAM_BLACK, '♛'],
    ]),
  ],
  [
    CHESS_PIECE_KIND.ROOK,
    new Map<Team, string>([
      [TEAM_WHITE, '♖'],
      [TEAM_BLACK, '♜'],
    ]),
  ],
  [
    CHESS_PIECE_KIND.BISHOP,
    new Map<Team, string>([
      [TEAM_WHITE, '♗'],
      [TEAM_BLACK, '♝'],
    ]),
  ],
  [
    CHESS_PIECE_KIND.KNIGHT,
    new Map<Team, string>([
      [TEAM_WHITE, '♘'],
      [TEAM_BLACK, '♞'],
    ]),
  ],
  [
    CHESS_PIECE_KIND.PAWN,
    new Map<Team, string>([
      [TEAM_WHITE, '♙'],
      [TEAM_BLACK, '♟'],
    ]),
  ],
]);

/* ──────────────────────────────────────────────────────────
 * Board square (parity) UI configuration
 * ────────────────────────────────────────────────────────── */

export const BOARD_PARITY = {
  EVEN: Symbol('even'),
  ODD: Symbol('odd'),
} as const;

export type BoardParity = (typeof BOARD_PARITY)[keyof typeof BOARD_PARITY];

export const CHESS_BOARD_SQUARE_UI = new Map<BoardParity, string>([
  [BOARD_PARITY.EVEN, ' '],
  [BOARD_PARITY.ODD, '·'],
]);

export const CHESS_ROW_UI: Record<string, number> = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
};

export type ChessRowUi = typeof CHESS_ROW_UI;
export type ChessRow = ChessRowUi[keyof ChessRowUi];

export const CHESS_ROW_TO_STRING = Object.fromEntries(
  Object.entries(CHESS_ROW_UI).map(([letter, row]) => [row, letter])
) as Record<ChessRow, string>;

export type ChessRowToString = typeof CHESS_ROW_TO_STRING;
