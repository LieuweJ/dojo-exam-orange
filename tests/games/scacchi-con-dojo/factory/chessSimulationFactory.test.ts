import { ChessSimulationFactory } from '../../../../src/games/scacchi-con-dojo/factory/chessSimulationFactory';
import { IMoveStrategy } from '../../../../src/core/strategy/player/move-strategy';
import { CoinPiece } from '../../../../src/sharedMechanics/connectLineGame/model/coinPiece';
import { BoardState, EMPTY_CELL } from '../../../../src/core/model/boardState';
import { Player } from '../../../../src/core/model/player';
import { ChessPiece } from '../../../../src/games/scacchi-con-dojo/model/chessPiece';

describe('ChessSimulationFactory error cases', () => {
  let factory: ChessSimulationFactory;
  let strategy: IMoveStrategy;

  beforeEach(() => {
    factory = new ChessSimulationFactory();

    strategy = {
      createNextMove: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('throws when the move piece is not found in the cloned board', () => {
    const boardPiece = new CoinPiece(Symbol('A'));
    const movePiece = new CoinPiece(Symbol('B')); // not on board

    const board = new BoardState([[boardPiece, EMPTY_CELL]]);

    const player = new Player('Alice', strategy, [boardPiece]);

    expect(() => {
      factory.createForMove(board, [player], {
        piece: movePiece as unknown as ChessPiece,
        position: { row: 0, column: 1 },
      });
    }).toThrow('Move piece not found in cloned board.');
  });
});
