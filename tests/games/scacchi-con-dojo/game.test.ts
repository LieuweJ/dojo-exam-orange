import { ChessPiece } from '../../../src/games/scacchi-con-dojo/model/chessPiece';
import { BoardState, EMPTY_CELL, IBoard } from '../../../src/core/model/boardState';
import {
  ChessMove,
  ChessMoveHandler,
} from '../../../src/games/scacchi-con-dojo/handler/ChessMoveHandler';
import { ChessPieceFactory } from '../../../src/games/scacchi-con-dojo/factory/chessPieceFactory';
import {
  CHESS_PIECE_KIND,
  ChessPieceKind,
} from '../../../src/games/scacchi-con-dojo/config/chessPiecesConfig';
import { Player } from '../../../src/core/model/player';
import { IMoveStrategy } from '../../../src/core/strategy/player/move-strategy';

const pieceFactory = new ChessPieceFactory();

const createTestPiece = (overrides?: {
  team?: string;
  kind?: Exclude<ChessPieceKind, typeof CHESS_PIECE_KIND.PAWN>;
  index?: number;
}) =>
  pieceFactory.create({
    team: Symbol(overrides?.team) || Symbol(''),
    kind: overrides?.kind ?? CHESS_PIECE_KIND.BISHOP,
    index: overrides?.index ?? 1,
  });

const createPawn = (overrides?: { team?: 'white' | 'black'; index?: number }) =>
  pieceFactory.createPawn({
    team: Symbol(overrides?.team) || Symbol('white'),
    index: overrides?.index ?? 1,
    forwardDirection:
      overrides?.team === 'black'
        ? { row: 1, column: 0 } // black pawns move down
        : { row: -1, column: 0 }, // white pawns move up
  });

describe('chess piece can be moved on the board', () => {
  let playerMoveStrategy: IMoveStrategy;

  beforeEach(() => {
    playerMoveStrategy = {
      createNextMove: jest.fn(),
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('a chess piece can move to an empty place on the board.', () => {
    const piece: ChessPiece = createTestPiece({
      team: 'white',
      kind: CHESS_PIECE_KIND.ROOK,
      index: 1,
    });

    const initBoard = new BoardState([
      [EMPTY_CELL, piece, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ]);

    const expectedBoardAfterMove: IBoard = [
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, piece, EMPTY_CELL],
    ];

    const move: ChessMove = {
      position: { row: 1, column: 1 },
      piece: piece,
    };

    const player = new Player('Player 1', playerMoveStrategy, [move.piece]);

    const moveHandler = new ChessMoveHandler(new ChessPieceFactory());

    moveHandler.handle(move, initBoard, player);

    const boardAfterMove = initBoard.getBoard();
    expect(boardAfterMove).toStrictEqual(expectedBoardAfterMove);
  });

  test('a chess piece can move to a place on the board which is already occupied.', () => {
    const attackingPiece = createTestPiece({ index: 1 });
    const defendingPiece = createTestPiece({ index: 2 });

    const initBoard = new BoardState([
      [EMPTY_CELL, attackingPiece, EMPTY_CELL],
      [EMPTY_CELL, defendingPiece, EMPTY_CELL],
    ]);

    const expectedBoardAfterMove: IBoard = [
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, attackingPiece, EMPTY_CELL],
    ];

    const move: ChessMove = {
      position: { row: 1, column: 1 },
      piece: attackingPiece,
    };

    const player = new Player('Player 1', playerMoveStrategy, [move.piece]);

    const moveHandler = new ChessMoveHandler(new ChessPieceFactory());

    moveHandler.handle(move, initBoard, player);

    const boardAfterMove = initBoard.getBoard();
    expect(boardAfterMove).toStrictEqual(expectedBoardAfterMove);
  });

  test('Throws when the chess piece we want to move is not already on the board.', async () => {
    const pieceNotOnBoard = createTestPiece({ index: 99 });

    const initBoard = new BoardState([
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ]);

    const move: ChessMove = {
      position: { row: 0, column: 1 },
      piece: pieceNotOnBoard,
    };

    const player = new Player('Player 1', playerMoveStrategy, [move.piece]);

    const moveHandler = new ChessMoveHandler(new ChessPieceFactory());

    expect(() => moveHandler.handle(move, initBoard, player)).toThrow(
      `The chess piece ${String(pieceNotOnBoard.getBoardValue())} is not present on the board. Chess piece cannot be moved.`
    );
  });

  test('king-side castling moves both king and rook correctly', async () => {
    const king = createTestPiece({
      team: 'white',
      kind: CHESS_PIECE_KIND.KING,
      index: 1,
    });

    const rook = createTestPiece({
      team: 'white',
      kind: CHESS_PIECE_KIND.ROOK,
      index: 1,
    });

    const e = EMPTY_CELL;

    const boardState = new BoardState([
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, king, e, e, rook],
    ]);

    const move: ChessMove = {
      piece: king,
      position: { row: 7, column: 6 }, // king-side castling
    };

    const moveHandler = new ChessMoveHandler(new ChessPieceFactory());

    const player = new Player('Player 1', playerMoveStrategy, [move.piece]);

    moveHandler.handle(move, boardState, player);

    const board = boardState.getBoard();

    // King moved to g1
    expect(board[7][6]).toBe(king);

    // Rook moved to f1
    expect(board[7][5]).toBe(rook);

    // Original squares cleared
    expect(board[7][4]).toBe(EMPTY_CELL);
    expect(board[7][7]).toBe(EMPTY_CELL);

    // Both pieces marked as moved
    expect(king.hasMoved()).toBe(true);
    expect(rook.hasMoved()).toBe(true);
  });
  test('queen-side castling moves both king and rook correctly', async () => {
    const e = EMPTY_CELL;

    const king = createTestPiece({
      team: 'white',
      kind: CHESS_PIECE_KIND.KING,
      index: 1,
    });

    const rook = createTestPiece({
      team: 'white',
      kind: CHESS_PIECE_KIND.ROOK,
      index: 1,
    });

    const boardState = new BoardState([
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [rook, e, e, e, king, e, e, e],
    ]);

    const move: ChessMove = {
      piece: king,
      position: { row: 7, column: 2 }, // c1
    };

    const moveHandler = new ChessMoveHandler(new ChessPieceFactory());
    const player = new Player('Player 1', playerMoveStrategy, [move.piece]);

    moveHandler.handle(move, boardState, player);

    const board = boardState.getBoard();

    // King → c1
    expect(board[7][2]).toBe(king);

    // Rook → d1
    expect(board[7][3]).toBe(rook);

    // Old squares cleared
    expect(board[7][4]).toBe(e);
    expect(board[7][0]).toBe(e);

    expect(king.hasMoved()).toBe(true);
    expect(rook.hasMoved()).toBe(true);
  });

  test('throws when castling rook is not found where expected', async () => {
    const e = EMPTY_CELL;

    const king = createTestPiece({
      team: 'white',
      kind: CHESS_PIECE_KIND.KING,
      index: 1,
    });

    // Important: NO rook on the board edge
    const boardState = new BoardState([
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, e, e, e, e],
      [e, e, e, e, king, e, e, e], // King on e1, rook missing on h1
    ]);

    const move: ChessMove = {
      piece: king,
      position: { row: 7, column: 6 }, // g1 → king-side castling attempt
    };

    const moveHandler = new ChessMoveHandler(new ChessPieceFactory());
    const player = new Player('Player 1', playerMoveStrategy, [move.piece]);

    expect(() => moveHandler.handle(move, boardState, player)).toThrow(
      'Castling rook not found where expected.'
    );
  });

  describe('en passant', () => {
    test('pawn double-step enables en passant for adjacent enemy pawns', async () => {
      const e = EMPTY_CELL;

      const whitePawn = createPawn({
        team: 'white',
        index: 1,
      });

      const blackPawn = createPawn({
        team: 'black',
        index: 1,
      });

      const boardState = new BoardState([
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, blackPawn, e, e, e, e, e], // d5
        [e, e, e, e, e, e, e, e],
        [e, e, e, whitePawn, e, e, e, e], // d2
        [e, e, e, e, e, e, e, e],
      ]);

      const moveHandler = new ChessMoveHandler(new ChessPieceFactory());

      // White pawn double-step: d2 → d4
      const player = new Player('Player 1', playerMoveStrategy, [whitePawn]);

      moveHandler.handle({ piece: whitePawn, position: { row: 4, column: 3 } }, boardState, player);

      expect(blackPawn.canEnPassantAttack({ row: 5, column: 3 }, boardState)).toBe(true);
    });

    test('en passant capture removes pawn and moves attacker correctly', async () => {
      const e = EMPTY_CELL;

      const whitePawn = createPawn({ team: 'white', index: 1 });
      const blackPawn = createPawn({ team: 'black', index: 1 });

      const boardState = new BoardState([
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, blackPawn, e, e, e, e], // d5
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, whitePawn, e, e, e, e], // d2
        [e, e, e, e, e, e, e, e],
      ]);

      const moveHandler = new ChessMoveHandler(new ChessPieceFactory());

      const player1 = new Player('Player 1', playerMoveStrategy, [whitePawn]);
      const player2 = new Player('Player 2', playerMoveStrategy, [blackPawn]);

      // d2 → d4
      moveHandler.handle(
        { piece: whitePawn, position: { row: 4, column: 3 } },
        boardState,
        player1
      );

      // en passant: d5 → d4
      moveHandler.handle(
        { piece: blackPawn, position: { row: 4, column: 3 } },
        boardState,
        player2
      );

      const board = boardState.getBoard();

      expect(board[4][3]).toBe(blackPawn); // black pawn moved
      expect(board[5][3]).toBe(e); // original black square cleared
      expect(board[4][3]).not.toBe(whitePawn); // white pawn captured
    });

    test('en passant is only available for one opponent move', async () => {
      const e = EMPTY_CELL;

      const whitePawn = createPawn({ team: 'white', index: 1 });
      const blackPawn = createPawn({ team: 'black', index: 1 });

      const blackRook = createTestPiece({
        team: 'black',
        kind: CHESS_PIECE_KIND.ROOK,
        index: 1,
      });

      const boardState = new BoardState([
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, blackPawn, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, whitePawn, e, e, e, e],
        [e, e, e, blackRook, e, e, e, e],
      ]);

      const moveHandler = new ChessMoveHandler(new ChessPieceFactory());

      const player1 = new Player('Player 1', playerMoveStrategy, [whitePawn]);
      const player2 = new Player('Player 2', playerMoveStrategy, [blackPawn]);

      // White: d2 → d4
      moveHandler.handle(
        { piece: whitePawn, position: { row: 4, column: 3 } },
        boardState,
        player1
      );

      // Black plays something else
      moveHandler.handle(
        { piece: blackRook, position: { row: 6, column: 3 } },
        boardState,
        player2
      );

      // En passant should now be invalid
      expect(blackPawn.canEnPassantAttack({ row: 4, column: 3 }, boardState)).toBe(false);
    });

    test('en passant is blocked if the landing square is occupied', async () => {
      const e = EMPTY_CELL;

      const whitePawn = createPawn({ team: 'white', index: 1 });
      const blackPawn = createPawn({ team: 'black', index: 1 });

      const whiteRook = createTestPiece({
        team: 'white',
        kind: CHESS_PIECE_KIND.ROOK,
        index: 1,
      });

      const boardState = new BoardState([
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, blackPawn, e, e, e, e], // d5
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, whitePawn, e, e, e, e], // d2
        [e, e, e, e, e, e, e, e],
      ]);

      const moveHandler = new ChessMoveHandler(new ChessPieceFactory());

      const player1 = new Player('Player 1', playerMoveStrategy, [whitePawn]);

      // White pawn double-step: d2 → d4
      moveHandler.handle(
        { piece: whitePawn, position: { row: 4, column: 3 } },
        boardState,
        player1
      );

      // Block en passant landing square (c4)
      boardState.addMove({
        piece: whiteRook,
        position: { row: 4, column: 2 },
      });

      // En passant should now be blocked
      expect(blackPawn.canEnPassantAttack({ row: 4, column: 2 }, boardState)).toBe(false);
    });

    test('en passant is not possible if the target pawn is no longer on the board', async () => {
      const e = EMPTY_CELL;

      const whitePawn = createPawn({ team: 'white', index: 1 });
      const blackPawn = createPawn({ team: 'black', index: 1 });

      const boardState = new BoardState([
        [e, e, e, e, e, e, e, e], // 0
        [e, e, e, e, e, e, e, e], // 1
        [e, e, e, e, e, e, e, e], // 2
        [e, e, e, e, e, e, e, e], // 3
        [e, e, blackPawn, e, e, e, e, e], // row 4: c4
        [e, e, e, e, e, e, e, e], // 5
        [e, e, e, whitePawn, e, e, e, e], // row 6: d2
        [e, e, e, e, e, e, e, e], // 7
      ]);

      const moveHandler = new ChessMoveHandler(new ChessPieceFactory());

      const player1 = new Player('Player 1', playerMoveStrategy, [whitePawn]);

      // White pawn double-step: d2 → d4
      moveHandler.handle(
        { piece: whitePawn, position: { row: 4, column: 3 } },
        boardState,
        player1
      );

      // Sanity: en passant would normally be possible
      expect(blackPawn.canEnPassantAttack({ row: 5, column: 3 }, boardState)).toBe(true);

      // Remove the target pawn (simulate capture / illegal state / bug elsewhere)
      boardState.clearPosition({ row: 4, column: 3 });

      // Now en passant must NOT be possible
      expect(blackPawn.canEnPassantAttack({ row: 5, column: 3 }, boardState)).toBe(false);
    });
  });

  test('moveHandler executes en passant capture and clears en passant state', async () => {
    const e = EMPTY_CELL;

    const whitePawn = createPawn({ team: 'white', index: 1 });
    const blackPawn = createPawn({ team: 'black', index: 1 });

    const boardState = new BoardState([
      [e, e, e, e, e, e, e, e], // 0
      [e, e, e, e, e, e, e, e], // 1
      [e, e, e, e, e, e, e, e], // 2
      [e, e, e, e, e, e, e, e], // 3
      [e, e, blackPawn, e, e, e, e, e], // row 4: c4
      [e, e, e, e, e, e, e, e], // 5
      [e, e, e, whitePawn, e, e, e, e], // row 6: d2
      [e, e, e, e, e, e, e, e], // 7
    ]);

    const moveHandler = new ChessMoveHandler(new ChessPieceFactory());

    const player1 = new Player('Player 1', playerMoveStrategy, [whitePawn]);
    const player2 = new Player('Player 2', playerMoveStrategy, [blackPawn]);

    // White pawn double-step: d2 → d4
    moveHandler.handle({ piece: whitePawn, position: { row: 4, column: 3 } }, boardState, player1);

    // Sanity check: en passant is available
    expect(blackPawn.canEnPassantAttack({ row: 5, column: 3 }, boardState)).toBe(true);

    // Black performs en passant: c4 → d3
    moveHandler.handle({ piece: blackPawn, position: { row: 5, column: 3 } }, boardState, player2);

    const board = boardState.getBoard();

    // Black pawn moved to en passant landing square
    expect(board[5][3]).toBe(blackPawn);

    // White pawn is removed (captured en passant)
    expect(board[4][3]).toBe(e);

    // Original black square cleared
    expect(board[4][2]).toBe(e);

    // En passant state cleared
    expect(blackPawn.canEnPassantAttack({ row: 6, column: 3 }, boardState)).toBe(false);
  });

  describe('pawn promotion', () => {
    test('pawn promotion replaces pawn with promoted piece and marks it as moved', async () => {
      const e = EMPTY_CELL;

      const whitePawn = createPawn({ team: 'white', index: 1 });

      const boardState = new BoardState([
        [e, e, e, e, e, e, e, e], // 0
        [e, e, e, e, e, e, e, e], // 1
        [e, e, e, e, e, e, e, e], // 2
        [e, e, e, e, e, e, e, e], // 3
        [e, e, e, e, e, e, e, e], // 4
        [e, e, e, e, e, e, e, e], // 5
        [e, e, e, e, e, e, e, e], // 6
        [e, e, e, whitePawn, e, e, e, e], // row 7: d8
      ]);

      const moveHandler = new ChessMoveHandler(new ChessPieceFactory());

      const player1 = new Player('Player 1', playerMoveStrategy, [whitePawn]);

      moveHandler.handle(
        {
          piece: whitePawn,
          position: { row: 0, column: 3 }, // promote
          promotionKind: CHESS_PIECE_KIND.QUEEN,
        },
        boardState,
        player1
      );

      const board = boardState.getBoard();
      const promoted = board[0][3];

      if (!(promoted instanceof ChessPiece)) {
        throw new Error('Promoted piece is not a ChessPiece instance. Test setup failed.');
      }

      expect(promoted).toBeInstanceOf(ChessPiece);
      expect(promoted).not.toBe(whitePawn);
      expect(promoted.getKind()).toBe(CHESS_PIECE_KIND.QUEEN);
      expect(promoted.hasMoved()).toBe(true);
      expect(player1.hasPiece(whitePawn)).toBe(false);
      expect(player1.hasPiece(promoted)).toBe(true);

      // Pawn removed
      expect(board[7][3]).toBe(e);
    });

    test('promotion assigns next available index for promoted piece kind', async () => {
      const e = EMPTY_CELL;

      const existingQueen = createTestPiece({
        team: 'white',
        kind: CHESS_PIECE_KIND.QUEEN,
        index: 1,
      });

      const pawn = createPawn({ team: 'white', index: 1 });

      const boardState = new BoardState([
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, pawn, existingQueen, e, e, e],
      ]);

      const moveHandler = new ChessMoveHandler(new ChessPieceFactory());

      const player1 = new Player('Player 1', playerMoveStrategy, [pawn]);

      moveHandler.handle(
        {
          piece: pawn,
          position: { row: 0, column: 3 },
          promotionKind: CHESS_PIECE_KIND.QUEEN,
        },
        boardState,
        player1
      );

      const promoted = boardState.getBoard()[0][3];

      if (!(promoted instanceof ChessPiece)) {
        throw new Error('Promoted piece is not a ChessPiece instance. Test setup failed.');
      }

      expect(promoted.getKind()).toBe(CHESS_PIECE_KIND.QUEEN);
      expect(promoted.getBoardValue().description).toContain('2'); // next index
    });

    test('promotion clears all en passant state', async () => {
      const e = EMPTY_CELL;

      const pawn = createPawn({ team: 'white', index: 1 });
      const blackPawn = createPawn({ team: 'black', index: 1 });

      const boardState = new BoardState([
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, blackPawn, e, e, e, e, e],
        [e, e, e, pawn, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
        [e, e, e, e, e, e, e, e],
      ]);

      const moveHandler = new ChessMoveHandler(new ChessPieceFactory());

      const player1 = new Player('Player 1', playerMoveStrategy, [pawn]);

      moveHandler.handle(
        {
          piece: pawn,
          position: { row: 0, column: 3 },
          promotionKind: CHESS_PIECE_KIND.QUEEN,
        },
        boardState,
        player1
      );

      expect(blackPawn.canEnPassantAttack({ row: 5, column: 3 }, boardState)).toBe(false);
    });

    test('throws when pawn reaches promotion rank without promotionKind', async () => {
      const e = EMPTY_CELL;

      const pawn = createPawn({ team: 'white', index: 1 });

      const boardState = new BoardState([
        [e, e, e, e, e, e, e, e], // 0
        [e, e, e, e, e, e, e, e], // 1
        [e, e, e, e, e, e, e, e], // 2
        [e, e, e, e, e, e, e, e], // 3
        [e, e, e, e, e, e, e, e], // 4
        [e, e, e, e, e, e, e, e], // 5
        [e, e, e, e, e, e, e, e], // 6
        [e, e, e, pawn, e, e, e, e], // row 7
      ]);

      const moveHandler = new ChessMoveHandler(new ChessPieceFactory());

      const player1 = new Player('Player 1', playerMoveStrategy, [pawn]);

      expect(() =>
        moveHandler.handle(
          {
            piece: pawn,
            position: { row: 0, column: 3 }, // promotion square
            // promotionKind missing on purpose
          },
          boardState,
          player1
        )
      ).toThrow('Promotion missing. Piece=ChessPiecePawn, to=0,3');
    });
  });
});
