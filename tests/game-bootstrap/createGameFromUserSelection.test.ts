import { createGameFromUserSelection } from '../../src/game-bootstrap/createGameFromUserSelection';
import { Game } from '../../src/core/game';
import { GameSelectionService } from '../../src/game-bootstrap/gameSelectionService';

jest.mock('../../src/game-bootstrap/gameSelectionService');

describe('createGameFromUserSelection', () => {
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
  };

  const mockGameDescriptor = {
    id: 'test-game',
    displayName: 'Test Game',
    requiredPlayers: 2,
    createComposition: jest.fn().mockReturnValue(mockComposition),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (GameSelectionService as jest.Mock).mockImplementation(() => ({
      selectGame: jest.fn().mockResolvedValue(mockGameDescriptor),
      collectPlayerNames: jest.fn().mockResolvedValue(['Alice', 'Bob']),
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('creates a game from user selection', async () => {
    const game = await createGameFromUserSelection({
      inputAdapter,
      outputAdapter,
    });

    expect(GameSelectionService).toHaveBeenCalledWith(
      inputAdapter,
      outputAdapter,
      expect.any(Array)
    );

    expect(mockGameDescriptor.createComposition).toHaveBeenCalledWith({
      inputAdapter,
      outputAdapter,
      playerNames: ['Alice', 'Bob'],
    });

    expect(game).toBeInstanceOf(Game);
  });

  it('propagates errors from game selection', async () => {
    (GameSelectionService as jest.Mock).mockImplementationOnce(() => ({
      selectGame: jest.fn().mockRejectedValue(new Error('Boom')),
      collectPlayerNames: jest.fn(),
    }));

    await expect(createGameFromUserSelection({ inputAdapter, outputAdapter })).rejects.toThrow(
      'Boom'
    );
  });

  it('propagates errors from composition creation', async () => {
    mockGameDescriptor.createComposition.mockImplementationOnce(() => {
      throw new Error('Invalid composition');
    });

    await expect(createGameFromUserSelection({ inputAdapter, outputAdapter })).rejects.toThrow(
      'Invalid composition'
    );
  });

  it('returns null if user opts to quit', async () => {
    (GameSelectionService as jest.Mock).mockImplementation(() => ({
      selectGame: jest.fn().mockResolvedValue(null),
    }));

    const game = await createGameFromUserSelection({
      inputAdapter,
      outputAdapter,
    });

    expect(GameSelectionService).toHaveBeenCalledWith(
      inputAdapter,
      outputAdapter,
      expect.any(Array)
    );

    expect(game).toBe(null);
  });
});
