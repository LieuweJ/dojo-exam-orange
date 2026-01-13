import { PlayerNameSelectionService } from '../../src/game-bootstrap/playerNameSelectionService';

describe('PlayerNameSelectionService', () => {
  it('retries when player name is empty', async () => {
    const input = {
      ask: jest.fn().mockResolvedValueOnce('').mockResolvedValueOnce('Alice'),
    };

    const output = {
      render: jest.fn(),
    };

    const service = new PlayerNameSelectionService(input as never, output as never);

    const names = await service.selectPlayerNames(1);

    expect(names).toEqual(['Alice']);
    expect(input.ask).toHaveBeenCalledTimes(2);
    expect(output.render).toHaveBeenCalledWith('Name cannot be empty.');
  });

  it('retries when player name is whitespace', async () => {
    const input = {
      ask: jest.fn().mockResolvedValueOnce('   ').mockResolvedValueOnce('Bob'),
    };

    const output = {
      render: jest.fn(),
    };

    const service = new PlayerNameSelectionService(input as never, output as never);

    const names = await service.selectPlayerNames(1);

    expect(names).toEqual(['Bob']);
    expect(input.ask).toHaveBeenCalledTimes(2);
    expect(output.render).toHaveBeenCalledWith('Name cannot be empty.');
  });

  it('retries when same player name is already provided', async () => {
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

    const service = new PlayerNameSelectionService(input as never, output as never);

    const names = await service.selectPlayerNames(2);

    expect(names).toEqual(['Alice', 'Bob']);
    expect(input.ask).toHaveBeenCalledTimes(3);
    expect(output.render).toHaveBeenCalledWith('Name must be unique. Please choose another name.');
  });

  it('reuses previous player name when input is empty', async () => {
    const input = {
      ask: jest.fn().mockResolvedValueOnce('Alice').mockResolvedValueOnce(''),
    };

    const output = {
      render: jest.fn(),
    };

    const service = new PlayerNameSelectionService(input as never, output as never);

    const firstRun = await service.selectPlayerNames(1);
    const secondRun = await service.selectPlayerNames(1);

    expect(firstRun).toEqual(['Alice']);
    expect(secondRun).toEqual(['Alice']);
    expect(input.ask).toHaveBeenCalledTimes(2);
  });
});
