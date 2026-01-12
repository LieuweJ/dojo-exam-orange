import { ChessPieceFactory } from '../../../../src/games/scacchi-con-dojo/factory/chessPieceFactory';
import { CHESS_PIECE_KIND } from '../../../../src/games/scacchi-con-dojo/config/chessPiecesConfig';
import { Team } from '../../../../src/core/model/team';
import { BoardState, EMPTY_CELL } from '../../../../src/core/model/boardState';
import { IKingInCheckDetector } from '../../../../src/games/scacchi-con-dojo/detector/KingInCheckDetector';
import { IMoveHandler } from '../../../../src/core/handler/MoveHandler';
import { ChessPiece } from '../../../../src/games/scacchi-con-dojo/model/chessPiece';
import { CheckMateDetector } from '../../../../src/games/scacchi-con-dojo/detector/CheckMateDetector';
import { ChessSimulationFactory } from '../../../../src/games/scacchi-con-dojo/factory/chessSimulationFactory';

describe('CheckMateDetector – defensive branches', () => {
  const white = Symbol('white') as Team;
  const black = Symbol('black') as Team;

  let factory: ChessPieceFactory;
  let kingInCheckDetector: IKingInCheckDetector;
  let moveHandler: jest.Mocked<IMoveHandler<ChessPiece>>;

  const chessSimulationFactory = new ChessSimulationFactory();

  beforeEach(() => {
    factory = new ChessPieceFactory();

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

    const result = detector.isCheckMate({ board, team: white });

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

    const result = detector.isCheckMate({ board, team: white });

    expect(result).toBe(true); // no escape found
    expect(moveHandler.handle).not.toHaveBeenCalled();
  });
});
