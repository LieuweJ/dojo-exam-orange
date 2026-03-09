import readline from 'node:readline';
import { PassThrough } from 'node:stream';
import { TerminalInputAdapter } from '../../../src/core/adapters/terminalInputAdapter';

jest.mock('node:readline');

describe('TerminalInputAdapter', () => {
  const questionMock = jest.fn();
  const closeMock = jest.fn();

  let fakeInput: PassThrough;
  let fakeOutput: PassThrough;

  beforeEach(() => {
    fakeInput = new PassThrough();
    fakeOutput = new PassThrough();

    (readline.createInterface as jest.Mock).mockReturnValue({
      question: questionMock,
      close: closeMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('resolves trimmed user input', async () => {
    const adapter = new TerminalInputAdapter(fakeInput, fakeOutput);

    questionMock.mockImplementation((_question: string, cb: (answer: string) => void) => {
      cb('  hello world  ');
    });

    const result = await adapter.ask('Enter text:');

    expect(readline.createInterface).toHaveBeenCalledWith({
      input: fakeInput,
      output: fakeOutput,
    });

    expect(questionMock).toHaveBeenCalledWith('Enter text:', expect.any(Function));
    expect(result).toBe('hello world');
  });

  it('closes the readline interface', () => {
    const adapter = new TerminalInputAdapter(fakeInput, fakeOutput);

    adapter.close();

    expect(closeMock).toHaveBeenCalled();
  });
});
