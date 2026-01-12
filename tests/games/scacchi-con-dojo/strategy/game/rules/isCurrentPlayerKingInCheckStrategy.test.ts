import { ChessPieceFactory } from '../../../../../../src/games/scacchi-con-dojo/factory/chessPieceFactory';
import { Team } from '../../../../../../src/core/model/team';
import { ChessMoveHandler } from '../../../../../../src/games/scacchi-con-dojo/handler/ChessMoveHandler';
import { KingInCheckDetector } from '../../../../../../src/games/scacchi-con-dojo/detector/KingInCheckDetector';
import { IsCurrentPlayerKingInCheckStrategy } from '../../../../../../src/games/scacchi-con-dojo/strategy/game/rules/isCurrentPlayerKingInCheckStrategy';
import { CHESS_PIECE_KIND } from '../../../../../../src/games/scacchi-con-dojo/config/chessPiecesConfig';
import { BoardState, EMPTY_CELL } from '../../../../../../src/core/model/boardState';
import { CHESS_RULE_VIOLATION_TYPES } from '../../../../../../src/games/scacchi-con-dojo/strategy/game/rules/violationTypes';
import { Player } from '../../../../../../src/core/model/player';
import { TurnState } from '../../../../../../src/core/model/turnState';
import { ChessPiece } from '../../../../../../src/games/scacchi-con-dojo/model/chessPiece';
import { ChessSimulationFactory } from '../../../../../../src/games/scacchi-con-dojo/factory/chessSimulationFactory';

describe('IsCurrentPlayerKingInCheckStrategy', () => {
  const white = Symbol('white') as Team;
  const black = Symbol('black') as Team;

  let factory: ChessPieceFactory;
  let moveHandler: ChessMoveHandler;
  let detector: KingInCheckDetector;
  let strategy: IsCurrentPlayerKingInCheckStrategy;

  let whiteKing: ChessPiece;
  let whiteBishop: ChessPiece;
  let blackRook: ChessPiece;
  let blackKing: ChessPiece;

  let whitePlayer: Player;
  let blackPlayer: Player;
  let turnState: TurnState;

  const simulationFactory = new ChessSimulationFactory();

  beforeEach(() => {
    factory = new ChessPieceFactory();
    moveHandler = new ChessMoveHandler(factory);
    detector = new KingInCheckDetector();
    strategy = new IsCurrentPlayerKingInCheckStrategy(detector, moveHandler, simulationFactory);

    whiteKing = factory.create({
      team: white,
      kind: CHESS_PIECE_KIND.KING,
      index: 1,
    });

    whiteBishop = factory.create({
      team: white,
      kind: CHESS_PIECE_KIND.BISHOP,
      index: 1,
    });

    blackRook = factory.create({
      team: black,
      kind: CHESS_PIECE_KIND.ROOK,
      index: 1,
    });

    blackKing = factory.create({
      team: black,
      kind: CHESS_PIECE_KIND.KING,
      index: 1,
    });

    whitePlayer = new Player(
      'white',
      {
        createNextMove: async () => {
          throw new Error('not used');
        },
      },
      [whiteKing, whiteBishop]
    );

    blackPlayer = new Player(
      'black',
      {
        createNextMove: async () => {
          throw new Error('not used');
        },
      },
      [blackRook, blackKing]
    );

    turnState = new TurnState([whitePlayer, blackPlayer]);
  });

  it('returns a violation when a move exposes own king to check', () => {
    const board = new BoardState([
      [EMPTY_CELL, blackRook, EMPTY_CELL, blackKing],
      [EMPTY_CELL, whiteBishop, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, whiteKing, EMPTY_CELL, EMPTY_CELL],
    ]);

    const result = strategy.check({
      move: {
        piece: whiteBishop,
        position: { row: 2, column: 2 },
      },
      moveContext: {
        board,
        turn: turnState,
      },
    });

    expect(result).toEqual([{ reason: CHESS_RULE_VIOLATION_TYPES.INVALID_OWN_KING_IN_CHECK }]);
  });

  it('returns null when the move does not put own king in check', () => {
    const board = new BoardState([
      [EMPTY_CELL, blackKing, EMPTY_CELL],
      [EMPTY_CELL, whiteBishop, blackRook],
      [EMPTY_CELL, whiteKing, EMPTY_CELL],
    ]);

    const result = strategy.check({
      move: {
        piece: whiteBishop,
        position: { row: 0, column: 0 },
      },
      moveContext: {
        board,
        turn: turnState,
      },
    });

    expect(result).toBeNull();
  });

  it('throws when the piece to move is not found on the board', () => {
    const board = new BoardState([[blackKing, EMPTY_CELL, whiteKing]]);

    expect(() =>
      strategy.check({
        move: {
          piece: whiteBishop,
          position: { row: 0, column: 0 },
        },
        moveContext: {
          board,
          turn: turnState,
        },
      })
    ).toThrow('Move piece not found in cloned board.');
  });

  it('throws when a player has no pieces on the board', () => {
    const board = new BoardState([[EMPTY_CELL]]);

    expect(() =>
      strategy.check({
        move: {
          piece: whiteBishop,
          position: { row: 0, column: 0 },
        },
        moveContext: {
          board,
          turn: turnState,
        },
      })
    ).toThrow('Player would have no pieces on the board after cloning; invariant violation.');
  });
});
