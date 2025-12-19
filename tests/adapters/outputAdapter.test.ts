import { TerminalOutputAdapter } from '../../src/adapters/terminalOutputAdapter';

describe('Output adapter', () => {
  let spy: jest.SpyInstance;
  let output: TerminalOutputAdapter;

  beforeEach(() => {
    spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    output = new TerminalOutputAdapter();
  });

  afterEach(() => {
    spy.mockRestore();
  })

  test('renders a message to the console', () => {
    output.render('hello world');

    expect(spy).toHaveBeenCalledWith('hello world');
  });
});