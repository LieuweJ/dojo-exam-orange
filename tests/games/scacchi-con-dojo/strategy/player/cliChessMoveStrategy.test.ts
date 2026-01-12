import {
  ChessPieceFactory,
  PAWN_DIRECTION,
  PAWN_FORWARD_VECTOR,
} from '../../../../../src/games/scacchi-con-dojo/factory/chessPieceFactory';
import { IInputAdapter } from '../../../../../src/core/adapters/terminalInputAdapter';
import { IOutputAdapter } from '../../../../../src/core/adapters/terminalOutputAdapter';
import {
  BoardPresentArgs,
  IOutputPresenter,
} from '../../../../../src/core/presenter/boardPresenter';
import { IMoveStrategy } from '../../../../../src/core/strategy/player/move-strategy';
import { BoardState, EMPTY_CELL, IBoard } from '../../../../../src/core/model/boardState';
import { Player } from '../../../../../src/core/model/player';
import { CliChessMoveStrategy } from '../../../../../src/games/scacchi-con-dojo/strategy/player/cliChessMoveStrategy';
import { CHESS_PIECE_KIND } from '../../../../../src/games/scacchi-con-dojo/config/chessPiecesConfig';
import {
  CHESS_PIECE_UI,
  TEAM_BLACK,
  TEAM_WHITE,
} from '../../../../../src/games/scacchi-con-dojo/composition/chessComposition';
import { CoinPiece } from '../../../../../src/sharedMechanics/connectLineGame/model/coinPiece';

describe('CliChessMoveStrategy', () => {
  const white: symbol = TEAM_WHITE;
  const black: symbol = TEAM_BLACK;

  let input: jest.Mocked<IInputAdapter>;
  let output: jest.Mocked<IOutputAdapter>;
  let boardPresenter: jest.Mocked<IOutputPresenter<BoardPresentArgs>>;
  let unusedMoveStrategy: IMoveStrategy;

  const factory = new ChessPieceFactory();

  const makeEmptyBoard = (): IBoard =>
    Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => EMPTY_CELL));

  beforeEach(() => {
    input = { ask: jest.fn() };
    output = { render: jest.fn() };
    boardPresenter = { present: jest.fn() };

    unusedMoveStrategy = {
      createNextMove: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('moves pawn forward without promotion', async () => {
    const boardState = new BoardState(makeEmptyBoard());

    const pawn = factory.createPawn({
      team: white,
      index: 1,
      forwardDirection: PAWN_FORWARD_VECTOR[PAWN_DIRECTION.TOWARDS_TOP],
    });

    boardState.addMove({ position: { row: 6, column: 4 }, piece: pawn });

    const player = new Player('White', unusedMoveStrategy, [pawn]);

    input.ask.mockResolvedValueOnce('e2').mockResolvedValueOnce('e4');

    const strategy = new CliChessMoveStrategy(input, output, boardPresenter, CHESS_PIECE_UI);

    const result = await strategy.createNextMove({
      context: { board: boardState.getBoard(), players: [player] },
      currentPlayer: player,
    });

    expect(result.piece).toBe(pawn);
    expect(result.position).toEqual({ row: 4, column: 4 });
    expect(result.promotionKind).toBeUndefined();
    expect(boardPresenter.present).toHaveBeenCalled();

    expect(input.ask).toHaveBeenCalledWith('White (♔), select a piece under to move (e.g. e2): ');
  });

  test('rejects selecting opponent piece', async () => {
    const boardState = new BoardState(makeEmptyBoard());

    const whitePawn = factory.createPawn({
      team: white,
      index: 1,
      forwardDirection: PAWN_FORWARD_VECTOR[PAWN_DIRECTION.TOWARDS_TOP],
    });

    const blackPawn = factory.createPawn({
      team: black,
      index: 1,
      forwardDirection: PAWN_FORWARD_VECTOR[PAWN_DIRECTION.TOWARDS_BOTTOM],
    });

    boardState.addMove({ position: { row: 6, column: 4 }, piece: whitePawn });
    boardState.addMove({ position: { row: 1, column: 4 }, piece: blackPawn });

    const player = new Player('White', unusedMoveStrategy, [whitePawn]);

    input.ask.mockResolvedValueOnce('e7').mockResolvedValueOnce('e2').mockResolvedValueOnce('e4');

    const strategy = new CliChessMoveStrategy(input, output, boardPresenter, CHESS_PIECE_UI);

    const result = await strategy.createNextMove({
      context: { board: boardState.getBoard(), players: [player] },
      currentPlayer: player,
    });

    expect(output.render).toHaveBeenCalledWith('That is not your piece.');
    expect(result.piece).toBe(whitePawn);
    expect(result.position).toEqual({ row: 4, column: 4 });
  });

  test('rejects unreachable destination and retries', async () => {
    const boardState = new BoardState(makeEmptyBoard());

    const pawn = factory.createPawn({
      team: white,
      index: 1,
      forwardDirection: PAWN_FORWARD_VECTOR[PAWN_DIRECTION.TOWARDS_TOP],
    });

    boardState.addMove({ position: { row: 6, column: 4 }, piece: pawn });

    const player = new Player('White', unusedMoveStrategy, [pawn]);

    input.ask.mockResolvedValueOnce('e2').mockResolvedValueOnce('e6').mockResolvedValueOnce('e4');

    const strategy = new CliChessMoveStrategy(input, output, boardPresenter, CHESS_PIECE_UI);

    const result = await strategy.createNextMove({
      context: { board: boardState.getBoard(), players: [player] },
      currentPlayer: player,
    });

    expect(output.render).toHaveBeenCalledWith('That square is not reachable.');
    expect(result.position).toEqual({ row: 4, column: 4 });
  });

  test('handles pawn promotion', async () => {
    const boardState = new BoardState(makeEmptyBoard());

    const pawn = factory.createPawn({
      team: white,
      index: 1,
      forwardDirection: PAWN_FORWARD_VECTOR[PAWN_DIRECTION.TOWARDS_TOP],
    });

    boardState.addMove({ position: { row: 1, column: 0 }, piece: pawn });

    const player = new Player('White', unusedMoveStrategy, [pawn]);

    input.ask.mockResolvedValueOnce('a7').mockResolvedValueOnce('a8').mockResolvedValueOnce('Q');

    const strategy = new CliChessMoveStrategy(input, output, boardPresenter, CHESS_PIECE_UI);

    const result = await strategy.createNextMove({
      context: { board: boardState.getBoard(), players: [player] },
      currentPlayer: player,
    });

    expect(result.promotionKind).toBe(CHESS_PIECE_KIND.QUEEN);
  });

  test('re-prompts on invalid promotion input', async () => {
    const boardState = new BoardState(makeEmptyBoard());

    const pawn = factory.createPawn({
      team: white,
      index: 1,
      forwardDirection: PAWN_FORWARD_VECTOR[PAWN_DIRECTION.TOWARDS_TOP],
    });

    boardState.addMove({ position: { row: 1, column: 0 }, piece: pawn });

    const player = new Player('White', unusedMoveStrategy, [pawn]);

    input.ask
      .mockResolvedValueOnce('a7')
      .mockResolvedValueOnce('a8')
      .mockResolvedValueOnce('X')
      .mockResolvedValueOnce('N');

    const strategy = new CliChessMoveStrategy(input, output, boardPresenter, CHESS_PIECE_UI);

    const result = await strategy.createNextMove({
      context: { board: boardState.getBoard(), players: [player] },
      currentPlayer: player,
    });

    expect(output.render).toHaveBeenCalledWith('Invalid promotion choice.');
    expect(result.promotionKind).toBe(CHESS_PIECE_KIND.KNIGHT);
  });

  test('renders "Invalid position format." (piece selection)', async () => {
    const boardState = new BoardState(makeEmptyBoard());

    const pawn = factory.createPawn({
      team: white,
      index: 1,
      forwardDirection: PAWN_FORWARD_VECTOR[PAWN_DIRECTION.TOWARDS_TOP],
    });

    boardState.addMove({ position: { row: 6, column: 4 }, piece: pawn });

    const player = new Player('White', unusedMoveStrategy, [pawn]);

    input.ask.mockResolvedValueOnce('z9').mockResolvedValueOnce('e2').mockResolvedValueOnce('e4');

    const strategy = new CliChessMoveStrategy(input, output, boardPresenter, CHESS_PIECE_UI);

    await strategy.createNextMove({
      context: { board: boardState.getBoard(), players: [player] },
      currentPlayer: player,
    });

    expect(output.render).toHaveBeenCalledWith('Invalid position format.');
  });

  test('renders "Invalid position format." (destination selection)', async () => {
    const boardState = new BoardState(makeEmptyBoard());

    const pawn = factory.createPawn({
      team: white,
      index: 1,
      forwardDirection: PAWN_FORWARD_VECTOR[PAWN_DIRECTION.TOWARDS_TOP],
    });

    boardState.addMove({ position: { row: 6, column: 4 }, piece: pawn });

    const player = new Player('White', unusedMoveStrategy, [pawn]);

    input.ask.mockResolvedValueOnce('e2').mockResolvedValueOnce('z9').mockResolvedValueOnce('e4');

    const strategy = new CliChessMoveStrategy(input, output, boardPresenter, CHESS_PIECE_UI);

    await strategy.createNextMove({
      context: { board: boardState.getBoard(), players: [player] },
      currentPlayer: player,
    });

    expect(output.render).toHaveBeenCalledWith('Invalid position format.');
  });

  test('renders "No piece at that position."', async () => {
    const boardState = new BoardState(makeEmptyBoard());

    const pawn = factory.createPawn({
      team: white,
      index: 1,
      forwardDirection: PAWN_FORWARD_VECTOR[PAWN_DIRECTION.TOWARDS_TOP],
    });

    boardState.addMove({ position: { row: 6, column: 4 }, piece: pawn });

    const player = new Player('White', unusedMoveStrategy, [pawn]);

    input.ask.mockResolvedValueOnce('a3').mockResolvedValueOnce('e2').mockResolvedValueOnce('e4');

    const strategy = new CliChessMoveStrategy(input, output, boardPresenter, CHESS_PIECE_UI);

    await strategy.createNextMove({
      context: { board: boardState.getBoard(), players: [player] },
      currentPlayer: player,
    });

    expect(output.render).toHaveBeenCalledWith('No piece at that position.');
  });

  test('renders "That piece has no legal moves."', async () => {
    const boardState = new BoardState(makeEmptyBoard());

    const deadPawn = factory.createPawn({
      team: white,
      index: 1,
      forwardDirection: PAWN_FORWARD_VECTOR[PAWN_DIRECTION.TOWARDS_TOP],
    });

    const movablePawn = factory.createPawn({
      team: white,
      index: 2,
      forwardDirection: PAWN_FORWARD_VECTOR[PAWN_DIRECTION.TOWARDS_TOP],
    });

    boardState.addMove({ position: { row: 0, column: 0 }, piece: deadPawn });
    boardState.addMove({ position: { row: 6, column: 4 }, piece: movablePawn });

    const player = new Player('White', unusedMoveStrategy, [deadPawn, movablePawn]);

    input.ask.mockResolvedValueOnce('a8').mockResolvedValueOnce('e2').mockResolvedValueOnce('e4');

    const strategy = new CliChessMoveStrategy(input, output, boardPresenter, CHESS_PIECE_UI);

    const result = await strategy.createNextMove({
      context: { board: boardState.getBoard(), players: [player] },
      currentPlayer: player,
    });

    expect(output.render).toHaveBeenCalledWith('That piece has no legal moves.');
    expect(result.piece).toBe(movablePawn);
    expect(result.position).toEqual({ row: 4, column: 4 });
  });

  test('does not ask for promotion when moving non-pawn piece', async () => {
    const boardState = new BoardState(makeEmptyBoard());

    const rook = factory.create({
      team: white,
      kind: CHESS_PIECE_KIND.ROOK,
      index: 1,
    });

    boardState.addMove({ position: { row: 7, column: 0 }, piece: rook });

    const player = new Player('White', unusedMoveStrategy, [rook]);

    input.ask.mockResolvedValueOnce('a1').mockResolvedValueOnce('a2');

    const strategy = new CliChessMoveStrategy(input, output, boardPresenter, CHESS_PIECE_UI);

    const result = await strategy.createNextMove({
      context: { board: boardState.getBoard(), players: [player] },
      currentPlayer: player,
    });

    expect(result.promotionKind).toBeUndefined();
    expect(input.ask).toHaveBeenCalledTimes(2);
  });

  test.each([
    ['Q', CHESS_PIECE_KIND.QUEEN],
    ['R', CHESS_PIECE_KIND.ROOK],
    ['B', CHESS_PIECE_KIND.BISHOP],
    ['N', CHESS_PIECE_KIND.KNIGHT],
  ])('maps promotion input %s correctly', async (inputChar, expectedKind) => {
    const boardState = new BoardState(makeEmptyBoard());

    const pawn = factory.createPawn({
      team: white,
      index: 1,
      forwardDirection: PAWN_FORWARD_VECTOR[PAWN_DIRECTION.TOWARDS_TOP],
    });

    boardState.addMove({ position: { row: 1, column: 0 }, piece: pawn });

    const player = new Player('White', unusedMoveStrategy, [pawn]);

    input.ask
      .mockResolvedValueOnce('a7')
      .mockResolvedValueOnce('a8')
      .mockResolvedValueOnce(inputChar);

    const strategy = new CliChessMoveStrategy(input, output, boardPresenter, CHESS_PIECE_UI);

    const result = await strategy.createNextMove({
      context: { board: boardState.getBoard(), players: [player] },
      currentPlayer: player,
    });

    expect(result.promotionKind).toBe(expectedKind);
  });

  test('retries destination selection when user enters retry token', async () => {
    const boardState = new BoardState(makeEmptyBoard());

    const pawn = factory.createPawn({
      team: white,
      index: 1,
      forwardDirection: PAWN_FORWARD_VECTOR[PAWN_DIRECTION.TOWARDS_TOP],
    });

    boardState.addMove({ position: { row: 6, column: 4 }, piece: pawn });

    const player = new Player('White', unusedMoveStrategy, [pawn]);

    input.ask
      .mockResolvedValueOnce('e2') // select piece
      .mockResolvedValueOnce('!') // retry destination → back to piece selection
      .mockResolvedValueOnce('e2') // reselect same piece
      .mockResolvedValueOnce('e4'); // valid destination

    const strategy = new CliChessMoveStrategy(input, output, boardPresenter, CHESS_PIECE_UI);

    const result = await strategy.createNextMove({
      context: { board: boardState.getBoard(), players: [player] },
      currentPlayer: player,
    });

    expect(boardPresenter.present).toHaveBeenCalledWith({
      board: boardState.getBoard(),
      players: [player],
    });

    expect(result.piece).toBe(pawn);
    expect(result.position).toEqual({ row: 4, column: 4 });
  });

  test('retries promotion selection when user enters retry token', async () => {
    const boardState = new BoardState(makeEmptyBoard());

    const pawn = factory.createPawn({
      team: white,
      index: 1,
      forwardDirection: PAWN_FORWARD_VECTOR[PAWN_DIRECTION.TOWARDS_TOP],
    });

    boardState.addMove({ position: { row: 1, column: 0 }, piece: pawn });

    const player = new Player('White', unusedMoveStrategy, [pawn]);

    input.ask
      .mockResolvedValueOnce('a7') // select pawn
      .mockResolvedValueOnce('a8') // promotion square
      .mockResolvedValueOnce('!') // retry promotion → back to piece selection
      .mockResolvedValueOnce('a7') // reselect pawn
      .mockResolvedValueOnce('a8') // promotion square again
      .mockResolvedValueOnce('Q'); // valid promotion

    const strategy = new CliChessMoveStrategy(input, output, boardPresenter, CHESS_PIECE_UI);

    const result = await strategy.createNextMove({
      context: { board: boardState.getBoard(), players: [player] },
      currentPlayer: player,
    });

    expect(boardPresenter.present).toHaveBeenCalledWith({
      board: boardState.getBoard(),
      players: [player],
    });

    expect(result.promotionKind).toBe(CHESS_PIECE_KIND.QUEEN);
  });

  test('retry during promotion does not emit invalid promotion error', async () => {
    const boardState = new BoardState(makeEmptyBoard());

    const pawn = factory.createPawn({
      team: white,
      index: 1,
      forwardDirection: PAWN_FORWARD_VECTOR[PAWN_DIRECTION.TOWARDS_TOP],
    });

    boardState.addMove({ position: { row: 1, column: 0 }, piece: pawn });

    const player = new Player('White', unusedMoveStrategy, [pawn]);

    input.ask
      .mockResolvedValueOnce('a7')
      .mockResolvedValueOnce('a8')
      .mockResolvedValueOnce('!') // retry promotion
      .mockResolvedValueOnce('a7')
      .mockResolvedValueOnce('a8')
      .mockResolvedValueOnce('N');

    const strategy = new CliChessMoveStrategy(input, output, boardPresenter, CHESS_PIECE_UI);

    await strategy.createNextMove({
      context: { board: boardState.getBoard(), players: [player] },
      currentPlayer: player,
    });

    expect(output.render).not.toHaveBeenCalledWith('Invalid promotion choice.');
  });

  test('renders if ui element cannot be detected', async () => {
    const boardState = new BoardState(makeEmptyBoard());

    const pawn = factory.createPawn({
      team: white,
      index: 1,
      forwardDirection: PAWN_FORWARD_VECTOR[PAWN_DIRECTION.TOWARDS_TOP],
    });

    boardState.addMove({ position: { row: 6, column: 4 }, piece: pawn });

    const noneChessPiece = new CoinPiece(Symbol('none-chess-piece'));

    const player = new Player('White', unusedMoveStrategy, [noneChessPiece, pawn]);

    input.ask.mockResolvedValueOnce('e2').mockResolvedValueOnce('e4');

    const strategy = new CliChessMoveStrategy(input, output, boardPresenter, CHESS_PIECE_UI);

    await strategy.createNextMove({
      context: { board: boardState.getBoard(), players: [player] },
      currentPlayer: player,
    });

    expect(input.ask).toHaveBeenCalledWith(
      'White (unknown side), select a piece under to move (e.g. e2): '
    );
  });

  test('renders if ui element cannot be translated to piece on screen', async () => {
    const boardState = new BoardState(makeEmptyBoard());

    const pawn = factory.createPawn({
      team: white,
      index: 1,
      forwardDirection: PAWN_FORWARD_VECTOR[PAWN_DIRECTION.TOWARDS_TOP],
    });

    boardState.addMove({ position: { row: 6, column: 4 }, piece: pawn });

    const player = new Player('White', unusedMoveStrategy, [pawn]);

    input.ask.mockResolvedValueOnce('e2').mockResolvedValueOnce('e4');

    const strategy = new CliChessMoveStrategy(input, output, boardPresenter, new Map());

    await strategy.createNextMove({
      context: { board: boardState.getBoard(), players: [player] },
      currentPlayer: player,
    });

    expect(input.ask).toHaveBeenCalledWith(
      'White (unknown side), select a piece under to move (e.g. e2): '
    );
  });
});
