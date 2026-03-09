import { GameFactory } from '../../src/game-bootstrap/gameFactory';
import { Game } from '../../src/core/game';
import { PlayerNameSelectionService } from '../../src/game-bootstrap/playerNameSelectionService';
import { GameDescriptor } from '../../src/game-bootstrap/composition/games-config';

describe('GameFactory.create', () => {
  const inputAdapter = { ask: jest.fn() };
  const outputAdapter = { render: jest.fn() };

  const mockComposition = {
    turnState: {} as never,
    boardState: {} as never,
    boardPresenter: {} as never,
    helpPresenter: {} as never,
    outcomeStrategy: {} as never,
    resultPresenter: {} as never,
    rulesChecker: {} as never,
    violationPresenter: {} as never,
    lifecycleStrategy: {} as never,
    moveHandler: {} as never,
    gameHistory: {} as never,
  };

  let playerNameSelectionService: jest.Mocked<PlayerNameSelectionService>;
  let factory: GameFactory;
  let mockGameDescriptor: GameDescriptor;

  beforeEach(() => {
    jest.clearAllMocks();

    playerNameSelectionService = {
      selectPlayerNames: jest.fn().mockResolvedValue(['Alice', 'Bob']),
    } as unknown as jest.Mocked<PlayerNameSelectionService>;

    mockGameDescriptor = {
      id: 'test-game',
      displayName: 'Test Game',
      requiredPlayers: 2,
      createComposition: jest.fn().mockReturnValue(mockComposition),
    };

    factory = new GameFactory(
      inputAdapter as never,
      outputAdapter as never,
      playerNameSelectionService
    );
  });

  it('creates a game from descriptor', async () => {
    const game = await factory.create(mockGameDescriptor);

    expect(playerNameSelectionService.selectPlayerNames).toHaveBeenCalledWith(2);

    expect(mockGameDescriptor.createComposition).toHaveBeenCalledWith({
      inputAdapter,
      outputAdapter,
      playerNames: ['Alice', 'Bob'],
    });

    expect(game).toBeInstanceOf(Game);
  });

  it('propagates errors from player name selection', async () => {
    playerNameSelectionService.selectPlayerNames.mockRejectedValueOnce(new Error('Boom'));

    await expect(factory.create(mockGameDescriptor)).rejects.toThrow('Boom');
  });

  it('propagates errors from composition creation', async () => {
    mockGameDescriptor.createComposition = jest.fn(() => {
      throw new Error('Invalid composition');
    });

    await expect(factory.create(mockGameDescriptor)).rejects.toThrow('Invalid composition');
  });
});
