import {
  BoardCell,
  EMPTY_CELL,
  IBoard,
  MARKER_O,
  MARKER_X,
  PlayerBoardMarker,
} from '../../../../src/core/model/boardState';
import {
  GAME_OUTCOME,
  GameOutcomeStrategy,
} from '../../../../src/core/strategy/game/gameOutcomeStrategy';
import { Player } from '../../../../src/core/model/player';
import { IMoveStrategy } from '../../../../src/core/strategy/player/cliMoveStrategy';
import { Move } from '../../../../src/core/model/rules';

const E: BoardCell = EMPTY_CELL;
const X: BoardCell = MARKER_X;
const O: BoardCell = MARKER_O;

describe('GameOutcomeStrategy', () => {
  const createStrategy = () => new GameOutcomeStrategy({ connectionLength: 4 });

  let playerStrategy: jest.Mocked<IMoveStrategy>;
  let playerO: Player;
  let playerX: Player;
  let players: Player[];

  beforeEach(() => {
    const createNextMove = jest.fn<Promise<Move>, [IBoard, PlayerBoardMarker, string]>();
    playerStrategy = {
      createNextMove,
    };

    playerO = new Player('Player O', playerStrategy, MARKER_O);
    playerX = new Player('Player X', playerStrategy, MARKER_X);

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

      const outcome = createStrategy().determine(board, players);

      if (outcome.type !== GAME_OUTCOME.WIN) {
        throw new Error('Expected WIN outcome');
      }

      expect(outcome.type).toBe(GAME_OUTCOME.WIN);
      expect(outcome.winner).toBe(playerO);
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

      const outcome = createStrategy().determine(board, players);

      expect(outcome).toEqual({
        type: GAME_OUTCOME.WIN,
        winner: playerX,
        winningPositions: [
          { row: 0, col: 0 },
          { row: 1, col: 1 },
          { row: 2, col: 2 },
          { row: 3, col: 3 },
        ],
      });
    });

    it('throws an error if no player matches the winning marker', () => {
      const board: IBoard = [
        [X, X, X, X],
        [E, E, E, E],
        [E, E, E, E],
        [E, E, E, E],
      ];

      const invalidPlayers: Player[] = [
        // Intentionally using invalid player piece for testing
        new Player('Player Y', playerStrategy, 'Y' as unknown as PlayerBoardMarker),
      ];

      expect(() => {
        createStrategy().determine(board, invalidPlayers);
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
        { row: 1, col: 0 },
        { row: 1, col: 1 },
        { row: 1, col: 2 },
      ]);
    });
  });
});
