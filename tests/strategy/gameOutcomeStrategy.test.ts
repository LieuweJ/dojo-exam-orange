import { EMPTY_CELL, MARKER_X, MARKER_O, IBoard, BoardCell } from '../../src/model/boardState';
import { GAME_OUTCOME, GameOutcomeStrategy } from '../../src/strategy/gameOutcomeStrategy';

const E: BoardCell = EMPTY_CELL;
const X: BoardCell  = MARKER_X;
const O: BoardCell  = MARKER_O;

describe('GameOutcomeStrategy', () => {
  const createStrategy = () =>
    new GameOutcomeStrategy({ connectionLength: 4 });

  describe('ONGOING', () => {
    it('returns ONGOING when no player has won and the board is not full', () => {
      const board: IBoard = [
        [E, E, E, E],
        [E, E, E, E],
        [E, E, E, E],
        [E, E, E, E],
      ];

      const outcome = createStrategy().determine(board);

      expect(outcome).toEqual({ type: GAME_OUTCOME.ONGOING });
    });
  });

  describe('DRAW', () => {
    it('returns DRAW when the board is full and no player has won', () => {
      const board: IBoard = [
        [X, O, X, O],
        [O, O, O, X],
        [X, X, X, O],
        [O, X, O, X],
      ];

      const outcome = createStrategy().determine(board);

      expect(outcome).toEqual({ type: GAME_OUTCOME.DRAW });
    });

    it('returns DRAW for a board with no rows in them.', () => {
      const board: IBoard = [];

      const outcome = createStrategy().determine(board);

      expect(outcome).toEqual({ type: GAME_OUTCOME.DRAW });
    });
  });

  describe('WIN', () => {
    it('detects a horizontal win and returns winning positions', () => {
      const board: IBoard = [
        [E, E, E, E],
        [E, E, E, E],
        [X, X, X, X],
        [E, E, E, E],
      ];

      const outcome = createStrategy().determine(board);

      expect(outcome).toEqual({
        type: GAME_OUTCOME.WIN,
        winner: X,
        winningPositions: [
          { row: 2, col: 0 },
          { row: 2, col: 1 },
          { row: 2, col: 2 },
          { row: 2, col: 3 },
        ],
      });
    });

    it('detects a vertical win', () => {
      const board: IBoard = [
        [E, O, E, E],
        [E, O, E, E],
        [E, O, E, E],
        [E, O, E, E],
      ];

      const outcome = createStrategy().determine(board);

      if (outcome.type !== GAME_OUTCOME.WIN) {
        throw new Error('Expected WIN outcome');
      }

      expect(outcome.type).toBe(GAME_OUTCOME.WIN);
      expect(outcome.winner).toBe(O);
      expect(outcome.winningPositions).toEqual([
        { row: 0, col: 1 },
        { row: 1, col: 1 },
        { row: 2, col: 1 },
        { row: 3, col: 1 },
      ]);
    });

    it('detects a diagonal win (↘)', () => {
      const board: IBoard = [
        [X, E, E, E],
        [E, X, E, E],
        [E, E, X, E],
        [E, E, E, X],
      ];

      const outcome = createStrategy().determine(board);

      expect(outcome).toEqual({
        type: GAME_OUTCOME.WIN,
        winner: X,
        winningPositions: [
          { row: 0, col: 0 },
          { row: 1, col: 1 },
          { row: 2, col: 2 },
          { row: 3, col: 3 },
        ],
      });
    });

    it('respects injected win condition length', () => {
      const strategy = new GameOutcomeStrategy({ connectionLength: 3 });

      const board: IBoard = [
        [E, E, E],
        [X, X, X],
        [E, E, E],
      ];

      const outcome = strategy.determine(board);

      if (outcome.type !== GAME_OUTCOME.WIN) {
        throw new Error('Expected WIN outcome');
      }

      expect(outcome.type).toBe(GAME_OUTCOME.WIN);
      expect(outcome.winner).toBe(X);
      expect(outcome.winningPositions).toEqual([
        { row: 1, col: 0 },
        { row: 1, col: 1 },
        { row: 1, col: 2 },
      ]);
    });
  });
});
