import { ChessPiece } from '../../../../../../src/games/scacchi-con-dojo/model/piece';
import { BoardState, EMPTY_CELL } from '../../../../../../src/core/model/boardState';
import { Move } from '../../../../../../src/core/model/rules';
import { ValidChessPlacementStrategy } from '../../../../../../src/games/scacchi-con-dojo/strategy/game/rules/validChessPlacementStrategy';
import { RulesChainHandler } from '../../../../../../src/core/strategy/game/rules/rulesChainHandler';
import { Player } from '../../../../../../src/core/model/player';
import { TurnState } from '../../../../../../src/core/model/turnState';
import { IMoveStrategy } from '../../../../../../src/core/strategy/player/move-strategy';
import {
  PIECE_O,
  PIECE_X,
} from '../../../../../../src/games/orange-in-a-row/composition/orangeInARowComposition';

describe('chess rules', () => {
  const e = EMPTY_CELL;
  let player1: Player;
  let player2: Player;

  let turnState: TurnState;

  let playerStrategy: jest.Mocked<IMoveStrategy>;

  beforeEach(() => {
    playerStrategy = {
      createNextMove: jest.fn(),
    };

    player1 = new Player('Player 1', playerStrategy, [PIECE_X]);
    player2 = new Player('Player 2', playerStrategy, [PIECE_O]);

    turnState = new TurnState({
      players: [player1, player2],
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('a move will be seen as invalid if the move.piece is not already on the board.', async () => {
    const pieceNotOnBoard: ChessPiece = new ChessPiece(Symbol('notPlacedPiece'));

    const initBoard = new BoardState([
      [e, e, e],
      [e, e, e],
    ]);

    const move: Move = {
      position: { row: 0, column: 1 },
      piece: pieceNotOnBoard,
    };

    const rulesChecker = new RulesChainHandler([new ValidChessPlacementStrategy()]);

    const violations = rulesChecker.check({
      move,
      moveContext: { board: initBoard, turn: turnState },
    });

    expect(violations).toStrictEqual(['INVALID_PLACEMENT']);
  });

  test('a move will be seen as invalid if the move.piece is on the same element as the current move.position on the board.', async () => {
    const piece: ChessPiece = new ChessPiece(Symbol('notPlacedPiece'));

    const initBoard = new BoardState([
      [e, piece, e],
      [e, e, e],
    ]);

    const move: Move = {
      position: { row: 0, column: 1 },
      piece: piece,
    };

    const rulesChecker = new RulesChainHandler([new ValidChessPlacementStrategy()]);

    const violations = rulesChecker.check({
      move,
      moveContext: { board: initBoard, turn: turnState },
    });

    expect(violations).toStrictEqual(['INVALID_PLACEMENT']);
  });

  test('a move will be seen as valid if the move.piece is on a different element than the current move.position on the board.', async () => {
    const piece: ChessPiece = new ChessPiece(Symbol('notPlacedPiece'));

    const initBoard = new BoardState([
      [e, e, e],
      [e, e, piece],
    ]);

    const move: Move = {
      position: { row: 0, column: 1 },
      piece: piece,
    };

    const rulesChecker = new RulesChainHandler([new ValidChessPlacementStrategy()]);

    const violations = rulesChecker.check({
      move,
      moveContext: { board: initBoard, turn: turnState },
    });

    expect(violations).toBe(null);
  });
});
