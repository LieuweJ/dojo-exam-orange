import { CapturedPiecesProvider } from '../../../../src/games/scacchi-con-dojo/provider/CapturedPiecesProvider';
import { BoardState, EMPTY_CELL } from '../../../../src/core/model/boardState';
import { Player } from '../../../../src/core/model/player';
import { IMoveStrategy } from '../../../../src/core/strategy/player/move-strategy';
import { IPiece } from '../../../../src/core/model/IPiece';

describe('CapturedPiecesProvider', () => {
  let moveStrategyMock: IMoveStrategy;

  beforeEach(() => {
    moveStrategyMock = {
      createNextMove: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('throws if first player piece is not a ChessPiece', () => {
    const provider = new CapturedPiecesProvider();

    const fakePiece: IPiece = {
      getBoardValue: () => Symbol('fake'),
      clone: () => fakePiece,
    };

    const invalidPlayer = new Player('Invalid', moveStrategyMock, [fakePiece]);

    const board = [[EMPTY_CELL]];
    const boardState = new BoardState(board);

    expect(() => provider.getCapturedPieces([invalidPlayer], boardState.getBoard())).toThrow(
      'Expected player pieces to be of type ChessPiece. Team cannot be determined.'
    );
  });
});
