// terminalInputAdapter.test.ts
import readline from 'node:readline';
import { TerminalInputAdapter } from '../../src/adapters/terminalInputAdapter';

jest.mock('node:readline');

describe('TerminalInputAdapter', () => {
  const questionMock = jest.fn();
  const closeMock = jest.fn();

  beforeEach(() => {
    (readline.createInterface as jest.Mock).mockReturnValue({
      question: questionMock,
      close: closeMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('resolves trimmed user input', async () => {
    const adapter = new TerminalInputAdapter();

    questionMock.mockImplementation((_question: string, cb: (answer: string) => void) => {
      cb('  hello world  ');
    });

    const result = await adapter.ask('Enter text:');

    expect(questionMock).toHaveBeenCalledWith('Enter text:', expect.any(Function));
    expect(result).toBe('hello world');
  });

  it('closes the readline interface', () => {
    const adapter = new TerminalInputAdapter();

    adapter.close();

    expect(closeMock).toHaveBeenCalled();
  });
});
