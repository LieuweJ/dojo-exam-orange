import { IOutputAdapter } from '../../../../src/core/adapters/terminalOutputAdapter';
import { BoardCell, BoardState, EMPTY_CELL } from '../../../../src/core/model/boardState';
import {
  ChessPieceFactory,
  ChessPieceSetByKind,
  PAWN_DIRECTION,
} from '../../../../src/games/scacchi-con-dojo/factory/chessPieceFactory';
import {
  BoardParity,
  CHESS_BOARD_SQUARE_UI,
  CHESS_PIECE_UI,
  CHESS_ROW_TO_STRING,
  ChessPieceUi,
  TEAM_BLACK,
  TEAM_WHITE,
} from '../../../../src/games/scacchi-con-dojo/composition/chessComposition';
import {
  CHESS_PIECE_KIND,
  ChessPieceKind,
} from '../../../../src/games/scacchi-con-dojo/config/chessPiecesConfig';
import { ChessBoardPresenter } from '../../../../src/games/scacchi-con-dojo/presenter/chessBoardPresenter';
import { CapturedPiecesProvider } from '../../../../src/games/scacchi-con-dojo/provider/CapturedPiecesProvider';
import { IMoveStrategy } from '../../../../src/core/strategy/player/move-strategy';
import { NonEmptyArray, Player } from '../../../../src/core/model/player';
import { ChessPiece } from '../../../../src/games/scacchi-con-dojo/model/chessPiece';

describe('ChessBoardPresenter', () => {
  let renderMock: jest.Mock<void, [string]>;
  let outputAdapter: IOutputAdapter;
  let moveStrategyMock: IMoveStrategy;

  const factory = new ChessPieceFactory();
  const capturedPiecesProvider = new CapturedPiecesProvider();

  beforeEach(() => {
    renderMock = jest.fn<void, [string]>();

    outputAdapter = { render: renderMock };

    moveStrategyMock = {
      createNextMove: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders board with captured pieces on multiple lines (visual test)', () => {
    const emptyRow = Array.from({ length: 8 }, () => EMPTY_CELL);
    const board = Array.from({ length: 8 }, () => [...emptyRow]);
    const boardState = new BoardState(board);

    const whitePieces = toNoneEmptyArray(
      factory.createInitialPieceSet(TEAM_WHITE, PAWN_DIRECTION.TOWARDS_TOP)
    );
    const blackPieces = toNoneEmptyArray(
      factory.createInitialPieceSet(TEAM_BLACK, PAWN_DIRECTION.TOWARDS_BOTTOM)
    );

    const whitePlayer = new Player('White', moveStrategyMock, whitePieces);
    const blackPlayer = new Player('Black', moveStrategyMock, blackPieces);

    // Place only a few pieces on the board
    const whiteKing = whitePieces.find((p) => p.getKind() === 'king')!;
    const whiteRook1 = whitePieces.find((p) => p.getKind() === 'rook')!;
    const blackKing = blackPieces.find((p) => p.getKind() === 'king')!;

    boardState.addMove({ piece: whiteKing, position: { row: 7, column: 4 } });
    boardState.addMove({ piece: whiteRook1, position: { row: 7, column: 0 } });
    boardState.addMove({ piece: blackKing, position: { row: 0, column: 4 } });

    const presenter = new ChessBoardPresenter(
      outputAdapter,
      CHESS_PIECE_UI,
      CHESS_BOARD_SQUARE_UI,
      CHESS_ROW_TO_STRING,
      capturedPiecesProvider
    );

    presenter.present({
      board: boardState.getBoard(),
      players: [whitePlayer, blackPlayer],
      highlightPositions: [
        { row: 7, column: 4 },
        { row: 0, column: 4 },
      ],
    });

    const output = renderMock.mock.calls[0][0];

    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(output).toBe(
      `♕ ♖ ♗ ♗ ♘ ♘ ♙         ┌---┬---┬---┬---┬---┬---┬---┬---┐     ♛ ♜ ♜ ♝ ♝ ♞ ♞ 
♙ ♙ ♙ ♙ ♙ ♙ ♙       8 |   | · |   | · |[♚]| · |   | · |     ♟ ♟ ♟ ♟ ♟ ♟ ♟ 
                      ├---┼---┼---┼---┼---┼---┼---┼---┤     ♟             
                    7 | · |   | · |   | · |   | · |   |                   
                      ├---┼---┼---┼---┼---┼---┼---┼---┤                   
                    6 |   | · |   | · |   | · |   | · |                   
                      ├---┼---┼---┼---┼---┼---┼---┼---┤                   
                    5 | · |   | · |   | · |   | · |   |                   
                      ├---┼---┼---┼---┼---┼---┼---┼---┤                   
                    4 |   | · |   | · |   | · |   | · |                   
                      ├---┼---┼---┼---┼---┼---┼---┼---┤                   
                    3 | · |   | · |   | · |   | · |   |                   
                      ├---┼---┼---┼---┼---┼---┼---┼---┤                   
                    2 |   | · |   | · |   | · |   | · |                   
                      ├---┼---┼---┼---┼---┼---┼---┼---┤                   
                    1 | ♖ |   | · |   |[♔]|   | · |   |                   
                      └---┴---┴---┴---┴---┴---┴---┴---┘                   
                        a   b   c   d   e   f   g   h  
                   `
    );
  });

  it('throws if an unknown BoardCell is encountered', () => {
    const board = [[{} as unknown as BoardCell]];
    const boardState = new BoardState(board);

    const presenter = new ChessBoardPresenter(
      outputAdapter,
      CHESS_PIECE_UI,
      CHESS_BOARD_SQUARE_UI,
      CHESS_ROW_TO_STRING,
      capturedPiecesProvider
    );

    expect(() =>
      presenter.present({
        board: boardState.getBoard(),
        players: [],
      })
    ).toThrow('Unknown BoardCell');
  });

  it('throws if square UI mapping is missing for a parity', () => {
    const board = [[EMPTY_CELL]];
    const boardState = new BoardState(board);

    const squareUi = new Map<BoardParity, string>(); // empty on purpose

    const presenter = new ChessBoardPresenter(
      outputAdapter,
      CHESS_PIECE_UI,
      squareUi,
      CHESS_ROW_TO_STRING,
      capturedPiecesProvider
    );

    expect(() => presenter.present({ board: boardState.getBoard(), players: [] })).toThrow(
      'Missing square UI for parity'
    );
  });

  it('throws if piece UI mapping is missing for a piece kind', () => {
    const emptyRow = [EMPTY_CELL];
    const board = [emptyRow];
    const boardState = new BoardState(board);

    const factory = new ChessPieceFactory();
    const piece = factory.create({
      team: TEAM_WHITE,
      kind: CHESS_PIECE_KIND.KING,
      index: 1,
    });

    boardState.addMove({ piece, position: { row: 0, column: 0 } });

    const pieceUi = new Map<ChessPieceKind, ChessPieceUi>(); // empty

    const presenter = new ChessBoardPresenter(
      outputAdapter,
      pieceUi,
      CHESS_BOARD_SQUARE_UI,
      CHESS_ROW_TO_STRING,
      capturedPiecesProvider
    );

    expect(() => presenter.present({ board: boardState.getBoard(), players: [] })).toThrow(
      'Missing UI mapping for piece kind'
    );
  });

  it('throws if piece UI mapping is missing for a team', () => {
    const emptyRow = [EMPTY_CELL];
    const board = [emptyRow];
    const boardState = new BoardState(board);

    const factory = new ChessPieceFactory();
    const piece = factory.create({
      team: TEAM_WHITE,
      kind: CHESS_PIECE_KIND.KING,
      index: 1,
    });

    boardState.addMove({ piece, position: { row: 0, column: 0 } });

    const pieceUi = new Map<ChessPieceKind, ChessPieceUi>([
      [CHESS_PIECE_KIND.KING, new Map()], // team missing
    ]);

    const presenter = new ChessBoardPresenter(
      outputAdapter,
      pieceUi,
      CHESS_BOARD_SQUARE_UI,
      CHESS_ROW_TO_STRING,
      capturedPiecesProvider
    );

    expect(() => presenter.present({ board: boardState.getBoard(), players: [] })).toThrow(
      'Missing UI symbol for team'
    );
  });

  it('fills missing captured column lines with empty strings', () => {
    const board = [[EMPTY_CELL]];
    const boardState = new BoardState(board);

    const presenter = new ChessBoardPresenter(
      outputAdapter,
      CHESS_PIECE_UI,
      CHESS_BOARD_SQUARE_UI,
      CHESS_ROW_TO_STRING,
      {
        getCapturedPieces: () =>
          new Map([
            [TEAM_BLACK, []],
            [TEAM_WHITE, []],
          ]),
      } as CapturedPiecesProvider
    );

    presenter.present({
      board: boardState.getBoard(),
      players: [],
    });

    const output = renderMock.mock.calls[0][0];

    expect(output).toContain('|');
  });

  it("renders '?' when captured piece has no UI symbol for its team", () => {
    const emptyRow = Array.from({ length: 8 }, () => EMPTY_CELL);
    const board = Array.from({ length: 8 }, () => [...emptyRow]);
    const boardState = new BoardState(board);

    const factory = new ChessPieceFactory();

    const whitePieces = toNoneEmptyArray(
      factory.createInitialPieceSet(TEAM_WHITE, PAWN_DIRECTION.TOWARDS_TOP)
    );
    const blackPieces = toNoneEmptyArray(
      factory.createInitialPieceSet(TEAM_BLACK, PAWN_DIRECTION.TOWARDS_BOTTOM)
    );

    const whitePlayer = new Player('White', moveStrategyMock, whitePieces);
    const blackPlayer = new Player('Black', moveStrategyMock, blackPieces);

    // Put only kings on the board → everything else is captured
    const whiteKing = whitePieces.find((p) => p.getKind() === 'king')!;
    const blackKing = blackPieces.find((p) => p.getKind() === 'king')!;

    boardState.addMove({ piece: whiteKing, position: { row: 7, column: 4 } });
    boardState.addMove({ piece: blackKing, position: { row: 0, column: 4 } });

    // Clone UI and REMOVE team mapping for pawns
    const brokenPieceUi = new Map(CHESS_PIECE_UI);
    brokenPieceUi.set(CHESS_PIECE_KIND.PAWN, new Map()); // no team symbols

    const presenter = new ChessBoardPresenter(
      outputAdapter,
      brokenPieceUi,
      CHESS_BOARD_SQUARE_UI,
      CHESS_ROW_TO_STRING,
      capturedPiecesProvider
    );

    presenter.present({
      board: boardState.getBoard(),
      players: [whitePlayer, blackPlayer],
    });

    const output = renderMock.mock.calls[0][0];

    expect(output).toContain('?');
  });

  it('renders empty captured column when team is missing from captured map', () => {
    const board = [[EMPTY_CELL]];
    const boardState = new BoardState(board);

    const factory = new ChessPieceFactory();

    const whitePieces = toNoneEmptyArray(
      factory.createInitialPieceSet(TEAM_WHITE, PAWN_DIRECTION.TOWARDS_TOP)
    );
    const blackPieces = toNoneEmptyArray(
      factory.createInitialPieceSet(TEAM_BLACK, PAWN_DIRECTION.TOWARDS_BOTTOM)
    );

    const whitePlayer = new Player('White', moveStrategyMock, whitePieces);
    const blackPlayer = new Player('Black', moveStrategyMock, blackPieces);

    const presenter = new ChessBoardPresenter(
      outputAdapter,
      CHESS_PIECE_UI,
      CHESS_BOARD_SQUARE_UI,
      CHESS_ROW_TO_STRING,
      {
        getCapturedPieces: () =>
          new Map([
            [TEAM_BLACK, []], // TEAM_WHITE intentionally missing
          ]),
      } as CapturedPiecesProvider
    );

    presenter.present({
      board: boardState.getBoard(),
      players: [whitePlayer, blackPlayer],
    });

    const output = renderMock.mock.calls[0][0];

    expect(output).toBe(`                      ┌---┐                   
                    1 |   |                   
                      └---┘                   
                        a  
                   `);
  });
});

function toNoneEmptyArray(byKind: ChessPieceSetByKind): NonEmptyArray<ChessPiece> {
  const array = Array.from(byKind.values()).flat();

  if (array.length === 0) {
    throw new Error('Array is empty');
  }

  return [array[0], ...array.slice(1)];
}
