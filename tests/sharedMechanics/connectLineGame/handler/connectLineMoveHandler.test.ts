import { ConnectLineMoveHandler } from '../../../../src/sharedMechanics/connectLineGame/handler/connectLineMoveHandler';
import { CoinPiece } from '../../../../src/sharedMechanics/connectLineGame/model/coinPiece';
import { IBoardState } from '../../../../src/core/model/boardState';

describe('ConnectLineMoveHandler – occupied destination guard', () => {
  it('throws when destination cell is already occupied', async () => {
    const handler = new ConnectLineMoveHandler();

    const occupyingPiece = new CoinPiece(Symbol('X'));
    const movingPiece = new CoinPiece(Symbol('O'));

    const boardState: IBoardState = {
      getBoardCellAt: jest.fn().mockReturnValue(occupyingPiece),
      addMove: jest.fn(),
    } as unknown as IBoardState;

    const move = {
      piece: movingPiece,
      position: { row: 1, column: 2 },
    };

    expect(() => handler.handle(move, boardState)).toThrow(
      'Invalid move: board position with row: 1 and 2 is already occupied'
    );

    expect(boardState.addMove).not.toHaveBeenCalled();
  });
});
