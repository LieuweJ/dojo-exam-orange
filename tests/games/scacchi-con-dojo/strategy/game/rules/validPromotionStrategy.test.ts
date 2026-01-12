import { CHESS_PIECE_KIND } from '../../../../../../src/games/scacchi-con-dojo/config/chessPiecesConfig';
import { ChessPieceFactory } from '../../../../../../src/games/scacchi-con-dojo/factory/chessPieceFactory';
import { ValidPromotionStrategy } from '../../../../../../src/games/scacchi-con-dojo/strategy/game/rules/validPromotionStrategy';
import { BoardState, EMPTY_CELL } from '../../../../../../src/core/model/boardState';
import { ProposedChessMove } from '../../../../../../src/games/scacchi-con-dojo/model/move';
import { Players, TurnState } from '../../../../../../src/core/model/turnState';
import { IPlayer, Player } from '../../../../../../src/core/model/player';
import { IMoveStrategy } from '../../../../../../src/core/strategy/player/move-strategy';
import {
  PIECE_O,
  PIECE_X,
} from '../../../../../../src/games/orange-in-a-row/composition/orangeInARowComposition';
import { CHESS_RULE_VIOLATION_TYPES } from '../../../../../../src/games/scacchi-con-dojo/strategy/game/rules/violationTypes';

const pieceFactory = new ChessPieceFactory();
const strategy = new ValidPromotionStrategy();

const createPawn = (team: 'white' | 'black' = 'white') =>
  pieceFactory.createPawn({
    team: Symbol(team),
    index: 1,
    forwardDirection: team === 'white' ? { row: -1, column: 0 } : { row: 1, column: 0 },
  });

const createNonPawn = () =>
  pieceFactory.create({
    team: Symbol('white'),
    kind: CHESS_PIECE_KIND.ROOK,
    index: 1,
  });

describe('ValidPromotionStrategy', () => {
  let playerStrategy: jest.Mocked<IMoveStrategy>;
  let playerO: IPlayer;
  let playerX: IPlayer;
  let players: Players;
  let baseContext: (board: BoardState) => Pick<ProposedChessMove, 'moveContext'>;

  beforeEach(() => {
    playerStrategy = {
      createNextMove: jest.fn(),
    };

    playerO = new Player('Player O', playerStrategy, [PIECE_O]);
    playerX = new Player('Player X', playerStrategy, [PIECE_X]);

    players = [playerX, playerO];

    baseContext = (board: BoardState) => ({
      moveContext: { board, turn: new TurnState(players) },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('pawn reaches last rank without promotionKind → INVALID', () => {
    const pawn = createPawn('white');

    const board = new BoardState([
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, pawn, EMPTY_CELL],
    ]);

    const proposedMove: ProposedChessMove = {
      move: { piece: pawn, position: { row: 0, column: 1 } },
      ...baseContext(board),
    };

    const result = strategy.check(proposedMove);

    expect(result).toStrictEqual([
      { reason: CHESS_RULE_VIOLATION_TYPES.INVALID_PROMOTION_MISSING_PROMOTION },
    ]);
  });

  test('promotionKind given but pawn is not promoting → INVALID', () => {
    const pawn = createPawn('white');

    const board = new BoardState([
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, pawn, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ]);

    const result = strategy.check({
      move: {
        piece: pawn,
        position: { row: 1, column: 1 },
        promotionKind: CHESS_PIECE_KIND.QUEEN,
      },
      ...baseContext(board),
    } as ProposedChessMove);

    expect(result).toStrictEqual([{ reason: CHESS_RULE_VIOLATION_TYPES.INVALID_PROMOTION }]);
  });

  test('promotionKind given for non-pawn → INVALID', () => {
    const rook = createNonPawn();

    const board = new BoardState([
      [EMPTY_CELL, rook, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ]);

    const result = strategy.check({
      move: {
        piece: rook,
        position: { row: 0, column: 1 },
        promotionKind: CHESS_PIECE_KIND.QUEEN,
      },
      ...baseContext(board),
    } as ProposedChessMove);

    expect(result).toStrictEqual([{ reason: CHESS_RULE_VIOLATION_TYPES.INVALID_PROMOTION }]);
  });

  test('pawn promotes to invalid piece → INVALID', () => {
    const pawn = createPawn('white');

    const board = new BoardState([
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, pawn, EMPTY_CELL],
    ]);

    const result = strategy.check({
      move: {
        piece: pawn,
        position: { row: 0, column: 1 },
        promotionKind: CHESS_PIECE_KIND.KING,
      },
      ...baseContext(board),
    } as ProposedChessMove);

    expect(result).toStrictEqual([
      { reason: CHESS_RULE_VIOLATION_TYPES.INVALID_PROMOTION_REQUESTED_PIECE_NOT_ALLOWED },
    ]);
  });

  test('pawn promotes to valid piece → OK', () => {
    const pawn = createPawn('white');

    const board = new BoardState([
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, pawn, EMPTY_CELL],
    ]);

    const result = strategy.check({
      move: {
        piece: pawn,
        position: { row: 0, column: 1 },
        promotionKind: CHESS_PIECE_KIND.QUEEN,
      },
      ...baseContext(board),
    } as ProposedChessMove);

    expect(result).toBeNull();
  });

  test('non-pawn normal move without promotion → OK', () => {
    const rook = createNonPawn();

    const board = new BoardState([
      [EMPTY_CELL, rook, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ]);

    const result = strategy.check({
      move: {
        piece: rook,
        position: { row: 0, column: 2 },
      },
      ...baseContext(board),
    } as ProposedChessMove);

    expect(result).toBeNull();
  });

  test('pawn not promoting and no promotionKind → OK', () => {
    const pawn = createPawn('white');

    const board = new BoardState([
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, pawn, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ]);

    const result = strategy.check({
      move: {
        piece: pawn,
        position: { row: 1, column: 1 },
      },
      ...baseContext(board),
    } as ProposedChessMove);

    expect(result).toBeNull();
  });
});
