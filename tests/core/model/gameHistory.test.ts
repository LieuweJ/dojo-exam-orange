import { EMPTY_CELL } from '../../../src/core/model/boardState';
import { GameHistory } from '../../../src/core/model/gameHistory';
import { CoinPiece } from '../../../src/sharedMechanics/connectLineGame/model/coinPiece';
import { Move } from '../../../src/core/model/rules';
import { Player } from '../../../src/core/model/player';
import { IMoveStrategy } from '../../../src/core/strategy/player/move-strategy';

describe('GameHistory.getInitialBoard', () => {
  it('returns the original board even after moves are recorded', () => {
    const initialBoard = [
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
    ];

    const history = new GameHistory(initialBoard);

    const myCoinSymbol = Symbol('myCoinSymbol');

    const dummyStrategy = {} as IMoveStrategy;
    const player = new Player('Bob', dummyStrategy, [new CoinPiece(myCoinSymbol)]);

    const piece = new CoinPiece(myCoinSymbol);

    const move: Move = {
      piece: piece,
      position: { row: 0, column: 1 },
    };

    history.record({
      move,
      player,
    });

    const boardFromHistory = history.getInitialBoard();

    expect(boardFromHistory[0][1]).toBe(EMPTY_CELL);
  });
});
