import fs from 'fs';
import path from 'path';
import { RulesPresenter } from '../../src/presenter/rulesPresenter';
import { IOutputAdapter } from '../../src/adapters/terminalOutputAdapter';

describe('RulesPresenter', () => {
  let outputAdapter: jest.Mocked<IOutputAdapter>;
  let presenter: RulesPresenter;
  let rulesFilePath: string;

  beforeEach(() => {
    outputAdapter = {
      render: jest.fn(),
    };

    rulesFilePath = path.join(__dirname, 'test-rules.md');

    fs.writeFileSync(rulesFilePath, '# Test Rules\n\nThese are the rules.', 'utf-8');

    presenter = new RulesPresenter(outputAdapter, rulesFilePath);
  });

  afterEach(() => {
    fs.unlinkSync(rulesFilePath);
    jest.clearAllMocks();
  });

  test('renders the rules of play', () => {
    presenter.present();

    expect(outputAdapter.render).toHaveBeenCalledWith('# Test Rules\n\nThese are the rules.');
  });

  test('renders an error message when rules file cannot be loaded', () => {
    const nonExistingPath = 'does-not-exist.md';

    const presenter = new RulesPresenter(outputAdapter, nonExistingPath);

    presenter.present();

    expect(outputAdapter.render).toHaveBeenCalledWith('Error: Unable to load the rules of play. Unknown error when trying to read the file.');
  });

  test('renders a generic error message when fs throws a non-Error value', () => {
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('My Boom!'); // non-Error throw
    });

    presenter.present();

    expect(outputAdapter.render).toHaveBeenCalledWith(
      'Error: Unable to load the rules of play. My Boom!'
    );
  });
});
