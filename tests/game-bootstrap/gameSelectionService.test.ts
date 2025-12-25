import { GameSelectionService } from '../../src/game-bootstrap/gameSelectionService';

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

    const service = new GameSelectionService(input, output, games);

    const selected = await service.selectGame();

    expect(selected.id).toBe('a');
    expect(input.ask).toHaveBeenCalledTimes(2);
  });

  it('retries when player name is empty or whitespace', async () => {
    const input = {
      ask: jest.fn().mockResolvedValueOnce('').mockResolvedValueOnce('Alice'),
    };

    const output = {
      render: jest.fn(),
    };

    const service = new GameSelectionService(input, output, [
      { id: 'x', displayName: 'Game', requiredPlayers: 1, createComposition: jest.fn() },
    ]);

    const names = await service.collectPlayerNames(1);

    expect(names).toEqual(['Alice']);
    expect(input.ask).toHaveBeenCalledTimes(2);

    expect(output.render).toHaveBeenCalledTimes(1);
    expect(output.render).toHaveBeenCalledWith('Name cannot be empty.');
  });

  it('retries when same player name is already provided for a different player', async () => {
    const input = {
      ask: jest
        .fn()
        .mockResolvedValueOnce('Alice')
        .mockResolvedValueOnce('Alice')
        .mockResolvedValueOnce('Bob'),
    };

    const output = {
      render: jest.fn(),
    };

    const service = new GameSelectionService(input, output, [
      { id: 'x', displayName: 'Game', requiredPlayers: 1, createComposition: jest.fn() },
    ]);

    const names = await service.collectPlayerNames(2);

    expect(names).toEqual(['Alice', 'Bob']);
    expect(input.ask).toHaveBeenCalledTimes(3);

    expect(output.render).toHaveBeenCalledTimes(1);
    expect(output.render).toHaveBeenCalledWith('Name must be unique. Please choose another name.');
  });

  it('retries when player name is whitespace', async () => {
    const input = {
      ask: jest.fn().mockResolvedValueOnce('    ').mockResolvedValueOnce('Bob'),
    };

    const output = {
      render: jest.fn(),
    };

    const service = new GameSelectionService(input, output, [
      { id: 'x', displayName: 'Game', requiredPlayers: 1, createComposition: jest.fn() },
    ]);

    const names = await service.collectPlayerNames(1);

    expect(names).toEqual(['Bob']);
    expect(input.ask).toHaveBeenCalledTimes(2);

    expect(output.render).toHaveBeenCalledTimes(1);
    expect(output.render).toHaveBeenCalledWith('Name cannot be empty.');
  });

  it('fails if no games are registered', () => {
    const input = {
      ask: jest.fn(),
    };

    const output = {
      render: jest.fn(),
    };

    expect(() => new GameSelectionService(input, output, [])).toThrow('No games registered.');
  });
});
