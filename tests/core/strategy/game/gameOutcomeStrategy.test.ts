import { BoardCell, EMPTY_CELL, IBoard } from '../../../../src/core/model/boardState';
import {
  GAME_OUTCOME,
  GameOutcomeStrategy,
} from '../../../../src/core/strategy/game/gameOutcomeStrategy';
import { Piece, Pieces, Player } from '../../../../src/core/model/player';
import { IMoveStrategy } from '../../../../src/core/strategy/player/move-strategy';
import { Move } from '../../../../src/core/model/rules';
import { PIECE_O, PIECE_X } from '../../../../src/composition/orangeInARowComposition';

const E: BoardCell = EMPTY_CELL;
const X: BoardCell = PIECE_X;
const O: BoardCell = PIECE_O;

describe('GameOutcomeStrategy', () => {
  const createStrategy = () => new GameOutcomeStrategy({ connectionLength: 4 });

  let playerStrategy: jest.Mocked<IMoveStrategy>;
  let playerO: Player;
  let playerX: Player;
  let players: Player[];

  beforeEach(() => {
    const createNextMove = jest.fn<Promise<Move>, [IBoard, Pieces, string]>();
    playerStrategy = {
      createNextMove,
    };

    playerO = new Player('Player O', playerStrategy, [PIECE_O]);
    playerX = new Player('Player X', playerStrategy, [PIECE_X]);

    players = [playerX, playerO];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ONGOING', () => {
    it('returns ONGOING when no player has won and the board is not full', () => {
      const board: IBoard = [
        [E, E, E, E],
        [E, E, E, E],
        [E, E, E, E],
        [E, E, E, E],
      ];

      const outcome = createStrategy().determine(board, players);

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

      const outcome = createStrategy().determine(board, players);

      expect(outcome).toEqual({ type: GAME_OUTCOME.DRAW });
    });

    it('returns DRAW for a board with no rows in them.', () => {
      const board: IBoard = [];

      const outcome = createStrategy().determine(board, players);

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

      const outcome = createStrategy().determine(board, players);

      expect(outcome).toEqual({
        type: GAME_OUTCOME.WIN,
        winner: playerX,
        winningPositions: [
          { row: 2, column: 0 },
          { row: 2, column: 1 },
          { row: 2, column: 2 },
          { row: 2, column: 3 },
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

      const outcome = createStrategy().determine(board, players);

      if (outcome.type !== GAME_OUTCOME.WIN) {
        throw new Error('Expected WIN outcome');
      }

      expect(outcome.type).toBe(GAME_OUTCOME.WIN);
      expect(outcome.winner).toBe(playerO);
      expect(outcome.winningPositions).toEqual([
        { row: 0, column: 1 },
        { row: 1, column: 1 },
        { row: 2, column: 1 },
        { row: 3, column: 1 },
      ]);
    });

    it('detects a diagonal win (↘)', () => {
      const board: IBoard = [
        [X, E, E, E],
        [E, X, E, E],
        [E, E, X, E],
        [E, E, E, X],
      ];

      const outcome = createStrategy().determine(board, players);

      expect(outcome).toEqual({
        type: GAME_OUTCOME.WIN,
        winner: playerX,
        winningPositions: [
          { row: 0, column: 0 },
          { row: 1, column: 1 },
          { row: 2, column: 2 },
          { row: 3, column: 3 },
        ],
      });
    });

    it('throws an error if winning combination cannot be matched to a player', () => {
      const U: Piece = {
        boardValue: Symbol('Piece which does not belong to any player.'),
      };

      const board: IBoard = [
        [U, U, U, U],
        [E, E, E, E],
        [E, E, E, E],
        [E, E, E, E],
      ];

      expect(() => {
        createStrategy().determine(board, players);
      }).toThrow('No player can be matched to the winning combination.');
    });

    it('respects injected win condition length', () => {
      const strategy = new GameOutcomeStrategy({ connectionLength: 3 });

      const board: IBoard = [
        [E, E, E],
        [X, X, X],
        [E, E, E],
      ];

      const outcome = strategy.determine(board, players);

      if (outcome.type !== GAME_OUTCOME.WIN) {
        throw new Error('Expected WIN outcome');
      }

      expect(outcome.type).toBe(GAME_OUTCOME.WIN);
      expect(outcome.winner).toBe(playerX);
      expect(outcome.winningPositions).toEqual([
        { row: 1, column: 0 },
        { row: 1, column: 1 },
        { row: 1, column: 2 },
      ]);
    });
  });
});
