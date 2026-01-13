import { GameSelectionService } from '../../src/game-bootstrap/gameSelectionService';
import { GameDescriptor } from '../../src/game-bootstrap/composition/games-config';

describe('GameSelectionService', () => {
  it('selects a game after invalid input', async () => {
    const input = {
      ask: jest.fn().mockResolvedValueOnce('99').mockResolvedValueOnce('1'),
    };

    const output = {
      render: jest.fn(),
    };

    const games = [
      { id: 'a', displayName: 'Game A', requiredPlayers: 2, createComposition: jest.fn() },
    ];

    const unlistedGames = new Map<string, GameDescriptor>([
      [
        'unlisted-key',
        { id: 'b', displayName: 'Game B', requiredPlayers: 2, createComposition: jest.fn() },
      ],
    ]);

    const service = new GameSelectionService(input as never, output as never, games, unlistedGames);

    const selected = await service.selectGame();

    expect(selected?.id).toBe('a');
    expect(input.ask).toHaveBeenCalledTimes(2);
    expect(output.render).toHaveBeenCalledWith('Invalid choice. Please select a valid game.');
  });

  it('fails if no games are registered', () => {
    const input = { ask: jest.fn() };
    const output = { render: jest.fn() };

    expect(() => new GameSelectionService(input as never, output as never, [], new Map())).toThrow(
      'No games registered.'
    );
  });

  it('can select "quit"', async () => {
    const input = {
      ask: jest.fn().mockResolvedValueOnce('2'),
    };

    const output = {
      render: jest.fn(),
    };

    const games = [
      { id: 'a', displayName: 'Game A', requiredPlayers: 2, createComposition: jest.fn() },
    ];

    const unlistedGames = new Map<string, GameDescriptor>([
      [
        'unlisted-key',
        { id: 'b', displayName: 'Game B', requiredPlayers: 2, createComposition: jest.fn() },
      ],
    ]);

    const service = new GameSelectionService(input as never, output as never, games, unlistedGames);

    const selected = await service.selectGame();

    expect(selected).toBeNull();
    expect(input.ask).toHaveBeenCalledTimes(1);
  });

  it('can select "unlisted game"', async () => {
    const input = {
      ask: jest.fn().mockResolvedValueOnce('unlisted-key'),
    };

    const output = {
      render: jest.fn(),
    };

    const games = [
      { id: 'a', displayName: 'Game A', requiredPlayers: 2, createComposition: jest.fn() },
    ];

    const unlistedGame = {
      id: 'b',
      displayName: 'Game B',
      requiredPlayers: 2,
      createComposition: jest.fn(),
    };

    const unlistedGames = new Map<string, GameDescriptor>([['unlisted-key', unlistedGame]]);

    const service = new GameSelectionService(input as never, output as never, games, unlistedGames);

    const selected = await service.selectGame();

    expect(selected).toStrictEqual(unlistedGame);
    expect(input.ask).toHaveBeenCalledTimes(1);
  });
});
