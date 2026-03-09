import { EMPTY_CELL } from '../../../src/core/model/boardState';
import { GameHistory } from '../../../src/core/model/gameHistory';
import { CoinPiece } from '../../../src/sharedMechanics/connectLineGame/model/coinPiece';
import { Move } from '../../../src/core/model/rules';
import { Player } from '../../../src/core/model/player';
import { IMoveStrategy } from '../../../src/core/strategy/player/move-strategy';

describe('GameHistory', () => {
  const myCoinSymbol = Symbol('myCoinSymbol');
  const dummyStrategy = {} as IMoveStrategy;

  const createPlayer = () => new Player('Bob', dummyStrategy, [new CoinPiece(myCoinSymbol)]);

  const createMove = (): Move => ({
    piece: new CoinPiece(myCoinSymbol),
    position: { row: 0, column: 1 },
  });

  describe('getInitialBoard', () => {
    it('returns the original board even after moves are recorded', () => {
      const initialBoard = [
        [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
        [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
      ];

      const history = new GameHistory(initialBoard);

      history.record({
        move: createMove(),
        player: createPlayer(),
      });

      const boardFromHistory = history.getInitialBoard();

      expect(boardFromHistory[0][1]).toBe(EMPTY_CELL);
    });

    it('returns a clone of the initial board', () => {
      const initialBoard = [
        [EMPTY_CELL, EMPTY_CELL],
        [EMPTY_CELL, EMPTY_CELL],
      ];

      const history = new GameHistory(initialBoard);

      const boardFromHistory = history.getInitialBoard();

      expect(boardFromHistory).not.toBe(initialBoard);
      expect(boardFromHistory[0]).not.toBe(initialBoard[0]);
    });
  });

  describe('record and getRecordedMoves', () => {
    it('stores a recorded move', () => {
      const history = new GameHistory([
        [EMPTY_CELL, EMPTY_CELL],
        [EMPTY_CELL, EMPTY_CELL],
      ]);

      const move = createMove();
      const player = createPlayer();

      history.record({ move, player });

      const recordedMoves = history.getRecordedMoves();

      expect(recordedMoves).toHaveLength(1);
      expect(recordedMoves[0]).toEqual({ move, player });
    });

    it('returns a copy of the recorded moves array', () => {
      const history = new GameHistory([
        [EMPTY_CELL, EMPTY_CELL],
        [EMPTY_CELL, EMPTY_CELL],
      ]);

      history.record({
        move: createMove(),
        player: createPlayer(),
      });

      const recordedMoves = history.getRecordedMoves();

      recordedMoves.pop();

      expect(history.getRecordedMoves()).toHaveLength(1);
    });
  });
});
