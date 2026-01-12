import {
  CHESS_PIECE_KIND,
  ChessPieceKind,
} from '../../../../src/games/scacchi-con-dojo/config/chessPiecesConfig';
import { Team } from '../../../../src/core/model/team';
import { IncorrectMove, PlayerRuleViolationType } from '../../../../src/core/model/rules';
import { IOutputAdapter } from '../../../../src/core/adapters/terminalOutputAdapter';
import { ChessViolationsPresenter } from '../../../../src/games/scacchi-con-dojo/presenter/chessViolationsPresenter';
import { PositionToChessBoardResolver } from '../../../../src/games/scacchi-con-dojo/resolver/positionToChessBoardResolver';
import { IPiece } from '../../../../src/core/model/IPiece';
import {
  CHESS_RULE_VIOLATION_TYPES,
  ChessRuleViolationType,
} from '../../../../src/games/scacchi-con-dojo/strategy/game/rules/violationTypes';
import { ChessPieceFactory } from '../../../../src/games/scacchi-con-dojo/factory/chessPieceFactory';

const TEAM_WHITE: Team = Symbol('white');
const TEAM_BLACK: Team = Symbol('black');

const CHESS_ROW_TO_STRING: Record<number, string> = {
  0: 'a',
  1: 'b',
  2: 'c',
  3: 'd',
  4: 'e',
  5: 'f',
  6: 'g',
  7: 'h',
};

const CHESS_PIECE_UI = new Map<ChessPieceKind, Map<Team, string>>([
  [
    CHESS_PIECE_KIND.KING,
    new Map([
      [TEAM_WHITE, '♔'],
      [TEAM_BLACK, '♚'],
    ]),
  ],
  [
    CHESS_PIECE_KIND.PAWN,
    new Map([
      [TEAM_WHITE, '♙'],
      [TEAM_BLACK, '♟'],
    ]),
  ],
]);

const VIOLATION_MESSAGES: Record<ChessRuleViolationType, string> = {
  INVALID_PLACEMENT: 'The move cannot be placed on the board.',
  INVALID_PLAYER_TURN: "It's not the player's turn to make a move.",
  INVALID_PLACEMENT_NO_CURRENT_POSITION: 'The piece is not on the board.',
  INVALID_PLACEMENT_CANNOT_REACH_POSITION: 'The piece cannot reach the specified position.',
  INVALID_PROMOTION: 'The move is not a valid promotion.',
  INVALID_PROMOTION_MISSING_PROMOTION: 'A promotion piece must be specified.',
  INVALID_PROMOTION_REQUESTED_PIECE_NOT_ALLOWED: 'The requested promotion piece is not allowed.',
  INVALID_OWN_KING_IN_CHECK: 'The move would leave your own king in check.',
  NOT_MOVED: 'The piece must be moved to a different position.',
};

describe('ChessViolationsPresenter', () => {
  let outputAdapter: jest.Mocked<IOutputAdapter>;
  let presenter: ChessViolationsPresenter<PlayerRuleViolationType>;

  const pieceFactory = new ChessPieceFactory();

  beforeEach(() => {
    outputAdapter = {
      render: jest.fn(),
    };

    presenter = new ChessViolationsPresenter(
      outputAdapter,
      VIOLATION_MESSAGES,
      CHESS_PIECE_UI,
      new PositionToChessBoardResolver(CHESS_ROW_TO_STRING)
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('renders a single violation with correct piece UI and board position', () => {
    const piece = pieceFactory.create({
      team: TEAM_WHITE,
      kind: CHESS_PIECE_KIND.KING,
      index: 1,
    });

    const incorrectMove: IncorrectMove<PlayerRuleViolationType> = {
      move: {
        piece,
        position: { row: 0, column: 4 }, // a5
      },
      violations: [{ reason: CHESS_RULE_VIOLATION_TYPES.INVALID_PLAYER_TURN }],
    };

    presenter.present(incorrectMove);

    expect(outputAdapter.render).toHaveBeenCalledWith(
      ['Invalid move: ♔ at a5:', "- It's not the player's turn to make a move."].join('\n')
    );
  });

  it('renders "unknown piece" when the piece is not a ChessPiece', () => {
    const unknownPiece: IPiece = {} as IPiece;

    const incorrectMove: IncorrectMove<PlayerRuleViolationType> = {
      move: {
        piece: unknownPiece,
        position: { row: 3, column: 3 }, // d4
      },
      violations: [{ reason: CHESS_RULE_VIOLATION_TYPES.INVALID_PLAYER_TURN }],
    };

    presenter.present(incorrectMove);

    expect(outputAdapter.render).toHaveBeenCalledWith(
      ['Invalid move: unknown piece at d4:', "- It's not the player's turn to make a move."].join(
        '\n'
      )
    );
  });

  it('renders a fallback message when no violations are provided', () => {
    const piece = pieceFactory.create({
      team: TEAM_WHITE,
      kind: CHESS_PIECE_KIND.KING,
      index: 1,
    });

    const incorrectMove: IncorrectMove<PlayerRuleViolationType> = {
      move: {
        piece,
        position: { row: 7, column: 4 }, // h5
      },
      violations: [],
    };

    presenter.present(incorrectMove);

    expect(outputAdapter.render).toHaveBeenCalledWith(
      ['Invalid move: ♔ at h5:', '- unknown violation'].join('\n')
    );
  });

  it('renders "unknown piece" when ChessPiece kind has no UI mapping', () => {
    const piece = pieceFactory.create({
      team: TEAM_WHITE,
      kind: CHESS_PIECE_KIND.QUEEN, // not present in CHESS_PIECE_UI
      index: 1,
    });

    const incorrectMove: IncorrectMove<PlayerRuleViolationType> = {
      move: {
        piece,
        position: { row: 0, column: 0 }, // a1
      },
      violations: [{ reason: CHESS_RULE_VIOLATION_TYPES.INVALID_PLAYER_TURN }],
    };

    presenter.present(incorrectMove);

    expect(outputAdapter.render).toHaveBeenCalledWith(
      ['Invalid move: unknown piece at a1:', "- It's not the player's turn to make a move."].join(
        '\n'
      )
    );
  });
});
