import { IInputAdapter } from '../../../../../src/core/adapters/terminalInputAdapter';
import { IOutputAdapter } from '../../../../../src/core/adapters/terminalOutputAdapter';
import { BoardCell, EMPTY_CELL, IBoard } from '../../../../../src/core/model/boardState';
import { Pieces, Player } from '../../../../../src/core/model/player';
import { CliTicTacToeInputResolver } from '../../../../../src/games/tic-tac-dojo/resolvers/cliInputResolver';
import { CliMoveStrategy } from '../../../../../src/games/tic-tac-dojo/strategy/player/cliMoveStrategy';
import { IPiece } from '../../../../../src/core/model/IPiece';
import { CoinPiece } from '../../../../../src/sharedMechanics/connectLineGame/model/coinPiece';

describe('CliMoveStrategy (Tic-Tac-Toe)', () => {
  let input: jest.Mocked<IInputAdapter>;
  let output: jest.Mocked<IOutputAdapter>;

  const EMPTY: BoardCell = EMPTY_CELL;
  const X: IPiece = new CoinPiece(Symbol('X'));

  const board: IBoard = [
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
  ];

  const pieces: Pieces = [X];

  const boardCellToUi = new Map<symbol, string>([[X.getBoardValue(), 'X']]);

  const TO_ROW_MAP = {
    a: 0,
    b: 1,
    c: 2,
  } as const;

  const resolver = new CliTicTacToeInputResolver(TO_ROW_MAP);

  beforeEach(() => {
    input = {
      ask: jest.fn(),
    };

    output = {
      render: jest.fn(),
    };
  });

  it('returns a move for valid input', async () => {
    input.ask.mockResolvedValueOnce('b2');

    const strategy = new CliMoveStrategy(input, output, boardCellToUi, resolver);

    const currentPlayer = new Player('Player 1', strategy, pieces);

    const move = await strategy.createNextMove({
      context: { board, players: [currentPlayer] },
      currentPlayer,
    });

    expect(move).toEqual({
      piece: X,
      position: { row: 1, column: 1 },
    });

    expect(output.render).not.toHaveBeenCalled();
  });

  it('retries after invalid input format', async () => {
    input.ask.mockResolvedValueOnce('22').mockResolvedValueOnce('a1');

    const strategy = new CliMoveStrategy(input, output, boardCellToUi, resolver);

    const currentPlayer = new Player('Player 1', strategy, pieces);

    const move = await strategy.createNextMove({
      context: { board, players: [currentPlayer] },
      currentPlayer,
    });

    expect(output.render).toHaveBeenCalledWith(
      `Input '22' is invalid. Please use a format like 'a1'.`
    );

    expect(move.position).toEqual({ row: 0, column: 0 });
  });

  it('retries when resolver rejects a valid-looking input', async () => {
    input.ask.mockResolvedValueOnce('d1').mockResolvedValueOnce('c3');

    const strategy = new CliMoveStrategy(input, output, boardCellToUi, resolver);

    const currentPlayer = new Player('Player 1', strategy, pieces);

    const move = await strategy.createNextMove({
      context: { board, players: [currentPlayer] },
      currentPlayer,
    });

    expect(output.render).toHaveBeenCalledWith(
      `Input 'd1' cannot be placed on the board. Please choose another position.`
    );

    expect(move.position).toEqual({ row: 2, column: 2 });
  });
});
