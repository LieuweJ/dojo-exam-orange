import { OutputAdapter } from '../../src/adapters/outputAdapter';

describe('Output adapter', () => {
  let spy: jest.SpyInstance;
  let output: OutputAdapter;

  beforeEach(() => {
    spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    output = new OutputAdapter();
  });

  afterEach(() => {
    spy.mockRestore();
  })

  test('renders a message to the console', () => {
    output.render('hello world');

    expect(spy).toHaveBeenCalledWith('hello world');
  });
});