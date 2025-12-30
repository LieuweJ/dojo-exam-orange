import { IBoard } from '../../../src/core/model/boardState';
import { Players, TurnState } from '../../../src/core/model/turnState';
import { Pieces, Player } from '../../../src/core/model/player';
import { IMoveStrategy } from '../../../src/core/strategy/player/move-strategy';
import { Move } from '../../../src/core/model/rules';
import {
  PIECE_O,
  PIECE_X,
} from '../../../src/games/orange-in-a-row/composition/orangeInARowComposition';

describe('Board.addMove', () => {
  let turnState: TurnState;

  let playerStrategy: jest.Mocked<IMoveStrategy>;
  let playerO: Player;
  let playerX: Player;
  let players: Players;

  beforeEach(() => {
    const createNextMove = jest.fn<Promise<Move>, [IBoard, Pieces, string]>();

    playerStrategy = {
      createNextMove,
    };

    playerO = new Player('Player O', playerStrategy, [PIECE_O]);
    playerX = new Player('Player X', playerStrategy, [PIECE_X]);

    players = [playerX, playerO];

    turnState = new TurnState(players);
  });

  it('can determine current player', () => {
    expect(turnState.getCurrentPlayer()).toBe(playerX);
    expect(turnState.currentPlayerOwnsPiece(PIECE_X)).toBe(true);
  });
});
