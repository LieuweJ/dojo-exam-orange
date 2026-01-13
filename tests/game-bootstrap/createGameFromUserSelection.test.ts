import { GameFactory } from '../../src/game-bootstrap/gameFactory';
import { Game } from '../../src/core/game';
import { GameSelectionService } from '../../src/game-bootstrap/gameSelectionService';
import { PlayerNameSelectionService } from '../../src/game-bootstrap/playerNameSelectionService';

describe('GameFactory.createGameFromUserSelection', () => {
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
  };

  const mockGameDescriptor = {
    id: 'test-game',
    displayName: 'Test Game',
    requiredPlayers: 2,
    createComposition: jest.fn().mockReturnValue(mockComposition),
  };

  let gameSelectionService: jest.Mocked<GameSelectionService>;
  let playerNameSelectionService: jest.Mocked<PlayerNameSelectionService>;
  let factory: GameFactory;

  beforeEach(() => {
    jest.clearAllMocks();

    gameSelectionService = {
      selectGame: jest.fn().mockResolvedValue(mockGameDescriptor),
    } as unknown as jest.Mocked<GameSelectionService>;

    playerNameSelectionService = {
      selectPlayerNames: jest.fn().mockResolvedValue(['Alice', 'Bob']),
    } as unknown as jest.Mocked<PlayerNameSelectionService>;

    factory = new GameFactory(
      inputAdapter as never,
      outputAdapter as never,
      gameSelectionService,
      playerNameSelectionService
    );
  });

  it('creates a game from user selection', async () => {
    const game = await factory.createGameFromUserSelection({
      inputAdapter,
      outputAdapter,
    });

    expect(gameSelectionService.selectGame).toHaveBeenCalled();

    expect(playerNameSelectionService.selectPlayerNames).toHaveBeenCalledWith(2);

    expect(mockGameDescriptor.createComposition).toHaveBeenCalledWith({
      inputAdapter,
      outputAdapter,
      playerNames: ['Alice', 'Bob'],
    });

    expect(game).toBeInstanceOf(Game);
  });

  it('propagates errors from game selection', async () => {
    gameSelectionService.selectGame.mockRejectedValueOnce(new Error('Boom'));

    await expect(
      factory.createGameFromUserSelection({ inputAdapter, outputAdapter })
    ).rejects.toThrow('Boom');
  });

  it('propagates errors from composition creation', async () => {
    mockGameDescriptor.createComposition.mockImplementationOnce(() => {
      throw new Error('Invalid composition');
    });

    await expect(
      factory.createGameFromUserSelection({ inputAdapter, outputAdapter })
    ).rejects.toThrow('Invalid composition');
  });

  it('returns null if user opts to quit', async () => {
    gameSelectionService.selectGame.mockResolvedValueOnce(null);

    const game = await factory.createGameFromUserSelection({
      inputAdapter,
      outputAdapter,
    });

    expect(game).toBeNull();
  });
});
