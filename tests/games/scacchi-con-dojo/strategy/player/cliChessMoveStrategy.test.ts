import { CliChessMoveStrategy } from '../../../../../src/games/scacchi-con-dojo/strategy/player/cliChessMoveStrategy';

describe('CliChessMoveStrategy', () => {
  describe('createNextMove', () => {
    it('throws a "not implemented yet" error', async () => {
      const strategy = new CliChessMoveStrategy();

      await expect(strategy.createNextMove()).rejects.toThrow('Not implemented yet');
    });
  });
});
