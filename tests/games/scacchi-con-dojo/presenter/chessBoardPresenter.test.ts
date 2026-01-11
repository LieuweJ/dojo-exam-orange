import { IOutputAdapter } from '../../../../src/core/adapters/terminalOutputAdapter';
import { BoardCell, BoardState, EMPTY_CELL } from '../../../../src/core/model/boardState';
import { ChessPieceFactory } from '../../../../src/games/scacchi-con-dojo/factory/chessPieceFactory';
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

describe('ChessBoardPresenter', () => {
  let renderMock: jest.Mock<void, [string]>;
  let outputAdapter: IOutputAdapter;

  beforeEach(() => {
    renderMock = jest.fn<void, [string]>();
    outputAdapter = { render: renderMock };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the board correctly', () => {
    const emptyRow = Array.from({ length: 8 }, () => EMPTY_CELL);
    const board = Array.from({ length: 8 }, () => [...emptyRow]);
    const boardState = new BoardState(board);

    const factory = new ChessPieceFactory();

    const whiteKing = factory.create({
      team: TEAM_WHITE,
      kind: CHESS_PIECE_KIND.KING,
      index: 1,
    });

    const blackKing = factory.create({
      team: TEAM_BLACK,
      kind: CHESS_PIECE_KIND.KING,
      index: 1,
    });

    const whiteRookA = factory.create({
      team: TEAM_WHITE,
      kind: CHESS_PIECE_KIND.ROOK,
      index: 1,
    });

    const whiteRookH = factory.create({
      team: TEAM_WHITE,
      kind: CHESS_PIECE_KIND.ROOK,
      index: 2,
    });

    boardState.addMove({ piece: whiteKing, position: { row: 7, column: 4 } });
    boardState.addMove({ piece: blackKing, position: { row: 0, column: 4 } });
    boardState.addMove({ piece: whiteRookA, position: { row: 7, column: 0 } });
    boardState.addMove({ piece: whiteRookH, position: { row: 7, column: 7 } });

    const presenter = new ChessBoardPresenter(
      outputAdapter,
      CHESS_PIECE_UI,
      CHESS_BOARD_SQUARE_UI,
      CHESS_ROW_TO_STRING
    );

    presenter.present({
      board: boardState.getBoard(),
      highlightPositions: [
        { row: 7, column: 4 },
        { row: 0, column: 4 },
      ],
    });

    const expectedOutput = `   ┌---┬---┬---┬---┬---┬---┬---┬---┐
 8 |   | · |   | · |[♚]| · |   | · |
   ├---┼---┼---┼---┼---┼---┼---┼---┤
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
 1 | ♖ |   | · |   |[♔]|   | · | ♖ |
   └---┴---┴---┴---┴---┴---┴---┴---┘
     a   b   c   d   e   f   g   h  
`;

    expect(renderMock).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledWith(expectedOutput);
  });

  it('throws if an unknown BoardCell is encountered', () => {
    const board = [[{} as unknown as BoardCell]];
    const boardState = new BoardState(board);

    const presenter = new ChessBoardPresenter(
      outputAdapter,
      CHESS_PIECE_UI,
      CHESS_BOARD_SQUARE_UI,
      CHESS_ROW_TO_STRING
    );

    expect(() => presenter.present({ board: boardState.getBoard() })).toThrow('Unknown BoardCell');
  });

  it('throws if square UI mapping is missing for a parity', () => {
    const board = [[EMPTY_CELL]];
    const boardState = new BoardState(board);

    const squareUi = new Map<BoardParity, string>(); // empty on purpose

    const presenter = new ChessBoardPresenter(
      outputAdapter,
      CHESS_PIECE_UI,
      squareUi,
      CHESS_ROW_TO_STRING
    );

    expect(() => presenter.present({ board: boardState.getBoard() })).toThrow(
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
      CHESS_ROW_TO_STRING
    );

    expect(() => presenter.present({ board: boardState.getBoard() })).toThrow(
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
      CHESS_ROW_TO_STRING
    );

    expect(() => presenter.present({ board: boardState.getBoard() })).toThrow(
      'Missing UI symbol for team'
    );
  });
});
