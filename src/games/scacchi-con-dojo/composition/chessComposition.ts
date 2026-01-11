import { CHESS_PIECE_KIND, ChessPieceKind } from '../config/chessPiecesConfig';
import { Team } from '../../../core/model/team';
import {
  GameComposition,
  GameCompositionInput,
} from '../../../game-bootstrap/composition/games-config';
import { BoardState, EMPTY_CELL, IBoard } from '../../../core/model/boardState';
import { TurnState } from '../../../core/model/turnState';
import { NonEmptyArray, Player } from '../../../core/model/player';
import { HelpPresenter } from '../../../core/presenter/helpPresenter';
import { GameOutcomePresenter } from '../../../core/presenter/gameOutcomePresenter';
import { RulesChainHandler } from '../../../core/strategy/game/rules/rulesChainHandler';
import { ValidPlayerTurnStrategy } from '../../../core/strategy/game/rules/validPlayerTurnStrategy';
import {
  CONNECT_LINE_VIOLATION_MESSAGES,
  ViolationsPresenter,
} from '../../../core/presenter/violationsPresenter';
import { PositionToOrangeInARowCliResolver } from '../../orange-in-a-row/resolvers/positionToOrangeInARowCliResolver';
import { GameLifecycleStrategy } from '../../../core/strategy/game/gameLifecycleStrategy';
import { ORANGE_IN_A_ROW_BOARD_UI } from '../../orange-in-a-row/composition/orangeInARowComposition';
import {
  ChessPieceFactory,
  ChessPieceSetByKind,
  PAWN_DIRECTION,
} from '../factory/chessPieceFactory';
import { ChessPiece } from '../model/chessPiece';
import { ChessBoardPresenter } from '../presenter/chessBoardPresenter';
import { CapturedPiecesProvider } from '../provider/CapturedPiecesProvider';
import { ChessGameOutcomeStrategy } from '../strategy/game/gameOutcomeStrategy';
import { KingInCheckDetector } from '../detector/KingInCheckDetector';
import { CheckMateDetector } from '../detector/CheckMateDetector';
import { ChessMoveHandler } from '../handler/ChessMoveHandler';
import { ValidChessPlacementStrategy } from '../strategy/game/rules/validChessPlacementStrategy';
import { ValidPromotionStrategy } from '../strategy/game/rules/validPromotionStrategy';
import { IsCurrentPlayerKingInCheckStrategy } from '../strategy/game/rules/isCurrentPlayerKingInCheckStrategy';
import { CliChessMoveStrategy } from '../strategy/player/cliChessMoveStrategy';

const HELP_FILE = 'docs/scacchi-con-dojo.md';
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

export function createChessComposition({
  inputAdapter,
  outputAdapter,
  playerNames,
}: GameCompositionInput): GameComposition {
  if (playerNames.length !== 2) {
    throw new Error('Scacchi con Dojo requires exactly 2 players.');
  }

  const piecesFactory = new ChessPieceFactory();

  const whiteByKind = piecesFactory.createInitialPieceSet(TEAM_WHITE, PAWN_DIRECTION.TOWARDS_TOP);
  const blackByKind = piecesFactory.createInitialPieceSet(
    TEAM_BLACK,
    PAWN_DIRECTION.TOWARDS_BOTTOM
  );

  const startingBoard = createStartingBoard(blackByKind, whiteByKind);

  const boardPresenter = new ChessBoardPresenter(
    outputAdapter,
    CHESS_PIECE_UI,
    CHESS_BOARD_SQUARE_UI,
    CHESS_ROW_TO_STRING,
    new CapturedPiecesProvider()
  );

  const cliMoveStrategy = new CliChessMoveStrategy(inputAdapter, outputAdapter, boardPresenter);

  const kingInCheckDetector = new KingInCheckDetector();
  const moveHandler = new ChessMoveHandler(piecesFactory);
  const checkMateDetector = new CheckMateDetector(kingInCheckDetector, moveHandler);

  return {
    turnState: new TurnState([
      new Player(playerNames[0], cliMoveStrategy, toNoneEmptyArray(whiteByKind)),
      new Player(playerNames[1], cliMoveStrategy, toNoneEmptyArray(blackByKind)),
    ]),
    boardState: new BoardState(startingBoard),
    boardPresenter,
    helpPresenter: new HelpPresenter(outputAdapter, HELP_FILE),
    outcomeStrategy: new ChessGameOutcomeStrategy(checkMateDetector, kingInCheckDetector),
    resultPresenter: new GameOutcomePresenter(boardPresenter, outputAdapter),
    rulesChecker: new RulesChainHandler([
      new ValidPlayerTurnStrategy(),
      new ValidChessPlacementStrategy(),
      new ValidPromotionStrategy(),
      new IsCurrentPlayerKingInCheckStrategy(kingInCheckDetector, moveHandler),
    ]),
    violationPresenter: new ViolationsPresenter(
      outputAdapter,
      CONNECT_LINE_VIOLATION_MESSAGES,
      ORANGE_IN_A_ROW_BOARD_UI,
      new PositionToOrangeInARowCliResolver()
    ),
    lifecycleStrategy: new GameLifecycleStrategy(),
    moveHandler,
  };
}

function createStartingBoard(
  blackByKind: ChessPieceSetByKind,
  whiteByKind: ChessPieceSetByKind
): IBoard {
  const e = EMPTY_CELL;

  const blackKing = requireKind(blackByKind, CHESS_PIECE_KIND.KING)[0];

  const whiteKing = requireKind(whiteByKind, CHESS_PIECE_KIND.KING)[0];
  const whiteRooks = requireKind(whiteByKind, CHESS_PIECE_KIND.ROOK);
  const whitePawn = requireKind(whiteByKind, CHESS_PIECE_KIND.PAWN)[0];

  return [
    // 0 ─ Black back rank (minimal, just king so game is valid)
    [e, e, e, e, blackKing, e, e, e],

    // 1
    [e, e, e, e, e, e, e, e],

    // 2
    [e, e, e, e, e, e, e, e],

    // 3
    [e, e, e, e, e, e, e, e],

    // 4
    [e, e, e, e, e, e, e, e],

    // 5
    [e, e, e, e, e, e, e, e],

    // 6 ─ White pawn one move from promotion
    [whitePawn, e, e, e, e, e, e, e],

    // 7 ─ White castling setup (king + rook, path clear)
    [whiteRooks[0], e, e, e, whiteKing, e, e, e],
  ];
}

// function createStartingBoard(
//   blackByKind: ChessPieceSetByKind,
//   whiteByKind: ChessPieceSetByKind
// ): IBoard {
//   const e = EMPTY_CELL;
//
//   const blackRooks = requireKind(blackByKind, CHESS_PIECE_KIND.ROOK);
//   const blackKnights = requireKind(blackByKind, CHESS_PIECE_KIND.KNIGHT);
//   const blackBishops = requireKind(blackByKind, CHESS_PIECE_KIND.BISHOP);
//   const blackQueen = requireKind(blackByKind, CHESS_PIECE_KIND.QUEEN);
//   const blackKing = requireKind(blackByKind, CHESS_PIECE_KIND.KING);
//   const blackPawns = requireKind(blackByKind, CHESS_PIECE_KIND.PAWN);
//
//   const whiteRooks = requireKind(whiteByKind, CHESS_PIECE_KIND.ROOK);
//   const whiteKnights = requireKind(whiteByKind, CHESS_PIECE_KIND.KNIGHT);
//   const whiteBishops = requireKind(whiteByKind, CHESS_PIECE_KIND.BISHOP);
//   const whiteQueen = requireKind(whiteByKind, CHESS_PIECE_KIND.QUEEN);
//   const whiteKing = requireKind(whiteByKind, CHESS_PIECE_KIND.KING);
//   const whitePawns = requireKind(whiteByKind, CHESS_PIECE_KIND.PAWN);
//
//   return [
//     [
//       blackRooks[0],
//       blackKnights[0],
//       blackBishops[0],
//       blackQueen[0],
//       blackKing[0],
//       blackBishops[1],
//       blackKnights[1],
//       blackRooks[1],
//     ],
//     blackPawns,
//     [e, e, e, e, e, e, e, e],
//     [e, e, e, e, e, e, e, e],
//     [e, e, e, e, e, e, e, e],
//     [e, e, e, e, e, e, e, e],
//     whitePawns,
//     [
//       whiteRooks[0],
//       whiteKnights[0],
//       whiteBishops[0],
//       whiteQueen[0],
//       whiteKing[0],
//       whiteBishops[1],
//       whiteKnights[1],
//       whiteRooks[1],
//     ],
//   ];
// }

function requireKind(byKind: ChessPieceSetByKind, kind: ChessPieceKind): ChessPiece[] {
  const pieces = byKind.get(kind);

  if (!pieces || pieces.length === 0) {
    throw new Error(`Expected pieces of kind ${kind}, but none were found`);
  }

  return pieces;
}

function toNoneEmptyArray(byKind: ChessPieceSetByKind): NonEmptyArray<ChessPiece> {
  const array = Array.from(byKind.values()).flat();

  if (array.length === 0) {
    throw new Error('Array is empty');
  }

  return [array[0], ...array.slice(1)];
}
