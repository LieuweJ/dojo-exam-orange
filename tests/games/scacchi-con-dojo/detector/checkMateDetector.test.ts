import { ChessPieceFactory } from '../../../../src/games/scacchi-con-dojo/factory/chessPieceFactory';
import { CHESS_PIECE_KIND } from '../../../../src/games/scacchi-con-dojo/config/chessPiecesConfig';
import { Team } from '../../../../src/core/model/team';
import { BoardState, EMPTY_CELL } from '../../../../src/core/model/boardState';
import { IKingInCheckDetector } from '../../../../src/games/scacchi-con-dojo/detector/KingInCheckDetector';
import { IMoveHandler } from '../../../../src/core/handler/MoveHandler';
import { ChessPiece } from '../../../../src/games/scacchi-con-dojo/model/chessPiece';
import { CheckMateDetector } from '../../../../src/games/scacchi-con-dojo/detector/CheckMateDetector';
import { ChessSimulationFactory } from '../../../../src/games/scacchi-con-dojo/factory/chessSimulationFactory';
import { IMoveStrategy } from '../../../../src/core/strategy/player/move-strategy';
import { Player } from '../../../../src/core/model/player';

describe('CheckMateDetector – defensive branches', () => {
  const white = Symbol('white') as Team;
  const black = Symbol('black') as Team;

  let factory: ChessPieceFactory;
  let kingInCheckDetector: IKingInCheckDetector;
  let moveHandler: jest.Mocked<IMoveHandler<ChessPiece>>;
  let playerMoveStrategy: IMoveStrategy;

  const chessSimulationFactory = new ChessSimulationFactory();

  beforeEach(() => {
    factory = new ChessPieceFactory();

    playerMoveStrategy = {
      createNextMove: jest.fn(),
    };

    kingInCheckDetector = {
      isInCheck: () => true, // force evaluation of escape logic
      getKingPosition: jest.fn(),
      getCheckingPieces: jest.fn(),
    };

    moveHandler = {
      handle: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('continues when cloned board cell is not a ChessPiece', () => {
    const whiteKing = factory.create({
      team: white,
      kind: CHESS_PIECE_KIND.KING,
      index: 1,
    });

    const blackRook = factory.create({
      team: black,
      kind: CHESS_PIECE_KIND.ROOK,
      index: 1,
    });

    const board = new BoardState([[whiteKing], [blackRook]]);

    jest.spyOn(board, 'clone').mockReturnValue({
      clonedBoard: new BoardState([[EMPTY_CELL], [EMPTY_CELL]]),
      clonedPieces: new Map(),
    });

    const detector = new CheckMateDetector(
      kingInCheckDetector,
      moveHandler,
      chessSimulationFactory
    );

    const result = detector.isCheckMate({ board, team: white, players: [] });

    expect(result).toBe(true); // no escape found
    expect(moveHandler.handle).not.toHaveBeenCalled();
  });

  it('continues when board.getPiecePositionBy returns undefined for a team piece', () => {
    const whiteKing = factory.create({
      team: white,
      kind: CHESS_PIECE_KIND.KING,
      index: 1,
    });

    const board = new BoardState([[whiteKing]]);

    jest.spyOn(board, 'getPiecePositionBy').mockReturnValue(undefined);

    const detector = new CheckMateDetector(
      kingInCheckDetector,
      moveHandler,
      chessSimulationFactory
    );

    const result = detector.isCheckMate({ board, team: white, players: [] });

    expect(result).toBe(true); // no escape found
    expect(moveHandler.handle).not.toHaveBeenCalled();
  });

  it('throws when cloned current player cannot be resolved for a cloned piece', () => {
    const whiteKing = factory.create({
      team: white,
      kind: CHESS_PIECE_KIND.KING,
      index: 1,
    });

    // Board must allow at least one move
    const board = new BoardState([[whiteKing, EMPTY_CELL]]);

    // Player owns a different piece (not on the board)
    const pieceNotOnBoard = factory.create({
      team: white,
      kind: CHESS_PIECE_KIND.ROOK,
      index: 1,
    });

    const player = new Player('player 1', playerMoveStrategy, [pieceNotOnBoard]);

    const detector = new CheckMateDetector(
      kingInCheckDetector,
      moveHandler,
      chessSimulationFactory
    );

    expect(() => {
      detector.isCheckMate({
        board,
        team: white,
        players: [player],
      });
    }).toThrow('Cloned current player not found.');
  });
});
