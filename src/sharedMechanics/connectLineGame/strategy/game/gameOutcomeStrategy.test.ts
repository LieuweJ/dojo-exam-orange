import { Team } from '../../../../core/model/team';
import { ChessPieceFactory } from '../../../../games/scacchi-con-dojo/factory/chessPieceFactory';
import { KingInCheckDetector } from '../../../../games/scacchi-con-dojo/detector/KingInCheckDetector';
import { CheckMateDetector } from '../../../../games/scacchi-con-dojo/detector/CheckMateDetector';
import { ChessGameOutcomeStrategy } from '../../../../games/scacchi-con-dojo/strategy/game/gameOutcomeStrategy';
import { Player } from '../../../../core/model/player';
import { CHESS_PIECE_KIND } from '../../../../games/scacchi-con-dojo/config/chessPiecesConfig';
import { BoardState, EMPTY_CELL } from '../../../../core/model/boardState';
import { GAME_OUTCOME } from '../../../../core/strategy/game/gameOutcomeStrategy';
import { ChessPiece } from '../../../../games/scacchi-con-dojo/model/chessPiece';
import { CoinPiece } from '../../model/coinPiece';
import { IMoveHandler } from '../../../../core/handler/MoveHandler';

describe('ChessGameOutcomeStrategy', () => {
  const white: Team = Symbol('white');
  const black: Team = Symbol('black');

  let factory: ChessPieceFactory;
  let kingInCheckDetector: KingInCheckDetector;

  let checkMateDetector: CheckMateDetector;
  let moveHandler: jest.Mocked<IMoveHandler<ChessPiece>>;

  let strategy: ChessGameOutcomeStrategy;

  let whiteKing: ChessPiece;
  let blackKing: ChessPiece;
  let blackRook: ChessPiece;

  let whitePlayer: Player;
  let blackPlayer: Player;

  beforeEach(() => {
    factory = new ChessPieceFactory();

    whiteKing = factory.create({
      team: white,
      kind: CHESS_PIECE_KIND.KING,
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
      [whiteKing]
    );

    blackPlayer = new Player(
      'black',
      {
        createNextMove: async () => {
          throw new Error('not used');
        },
      },
      [blackRook]
    );

    kingInCheckDetector = new KingInCheckDetector();

    moveHandler = {
      handle: jest.fn(),
    };

    checkMateDetector = new CheckMateDetector(kingInCheckDetector, moveHandler);

    strategy = new ChessGameOutcomeStrategy(checkMateDetector, kingInCheckDetector);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns ONGOING when no player is in checkmate', () => {
    const board = new BoardState([
      [whiteKing, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, blackRook, blackKing],
    ]);

    const result = strategy.determine(board.getBoard(), [whitePlayer, blackPlayer]);

    expect(result).toEqual({ type: GAME_OUTCOME.ONGOING });
  });

  it('returns WIN when a player is checkmated', () => {
    const board = new BoardState([
      [whiteKing, EMPTY_CELL, EMPTY_CELL],
      [blackRook, EMPTY_CELL, blackKing],
    ]);

    const result = strategy.determine(board.getBoard(), [whitePlayer, blackPlayer]);

    if (result.type !== GAME_OUTCOME.WIN) {
      throw new Error('Expected result to be a WIN outcome');
    }

    expect(result.type).toBe(GAME_OUTCOME.WIN);
    expect(result.winner).toBe(blackPlayer);
    expect(result.winningPositions).toEqual([
      { row: 0, column: 0 },
      { row: 1, column: 0 },
    ]);
  });

  it('returns ONGOING when a legal escape move exists (covers escape-found branch)', () => {
    // Force:
    // - initial position: king is in check
    // - after first simulated move: king is NOT in check
    jest
      .spyOn(kingInCheckDetector, 'isInCheck')
      .mockReturnValueOnce(true) // initial board
      .mockReturnValueOnce(false); // after first simulated move

    const board = new BoardState([
      [whiteKing, EMPTY_CELL],
      [blackRook, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, blackKing],
    ]);

    const result = strategy.determine(board.getBoard(), [whitePlayer, blackPlayer]);

    expect(result).toEqual({ type: GAME_OUTCOME.ONGOING });
  });

  it('throws when a player has no ChessPiece assigned', () => {
    const fakePiece = {
      getBoardValue: () => Symbol('X'),
      clone: () => fakePiece,
    };

    const noneChessPiece = new CoinPiece(Symbol('none-chess-piece'));

    const invalidPlayer = new Player(
      'invalid',
      {
        createNextMove: async () => {
          throw new Error('not used');
        },
      },
      [noneChessPiece]
    );

    const board = new BoardState([[EMPTY_CELL]]);

    expect(() => strategy.determine(board.getBoard(), [invalidPlayer])).toThrow(
      'Player does not have a chessPiece assigned to them'
    );
  });

  it('throws when attacking piece is not found on board', () => {
    const board = new BoardState([[whiteKing], [EMPTY_CELL], [EMPTY_CELL], [blackKing]]);

    jest.spyOn(kingInCheckDetector, 'isInCheck').mockReturnValue(true);
    jest.spyOn(kingInCheckDetector, 'getCheckingPieces').mockReturnValue([blackRook]); // NOT on board

    expect(() => strategy.determine(board.getBoard(), [whitePlayer, blackPlayer])).toThrow(
      'Attacking piece not found on board'
    );
  });

  it('throws when opponent is not found (single-player game)', () => {
    const board = new BoardState([[whiteKing, EMPTY_CELL, EMPTY_CELL, blackRook]]);

    expect(() => strategy.determine(board.getBoard(), [whitePlayer])).toThrow(
      'Opponent not found.'
    );
  });
});
