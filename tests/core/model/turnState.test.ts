import { IBoard, MARKER_O, MARKER_X } from '../../../src/core/model/boardState';
import { TurnState } from '../../../src/core/model/turnState';
import { Pieces, Player } from '../../../src/core/model/player';
import { IMoveStrategy } from '../../../src/core/strategy/player/cliMoveStrategy';
import { Move } from '../../../src/core/model/rules';

describe('Board.addMove', () => {
  let turnState: TurnState;

  let playerStrategy: jest.Mocked<IMoveStrategy>;
  let playerO: Player;
  let playerX: Player;
  let players: Player[];

  beforeEach(() => {
    const createNextMove = jest.fn<Promise<Move>, [IBoard, Pieces, string]>();

    playerStrategy = {
      createNextMove,
    };

    playerO = new Player('Player O', playerStrategy, [MARKER_O]);
    playerX = new Player('Player X', playerStrategy, [MARKER_X]);

    players = [playerX, playerO];

    turnState = new TurnState({ players });
  });

  it('can determine current player', () => {
    expect(turnState.getCurrentPlayer()).toBe(playerX);
    expect(turnState.currentPlayerOwnsPiece(MARKER_X)).toBe(true);
  });
});
