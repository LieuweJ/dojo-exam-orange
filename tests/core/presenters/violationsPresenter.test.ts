import { IOutputAdapter } from '../../../src/core/adapters/terminalOutputAdapter';
import {
  VIOLATION_MESSAGES,
  ViolationsPresenter,
} from '../../../src/core/presenter/violationsPresenter';
import { IncorrectMove, RULES_VIOLATIONS, RuleViolation } from '../../../src/core/model/rules';
import { BOARD_CELL_TO_UI } from '../../../src/core/presenter/boardPresenter';
import { MARKER_O, MARKER_X } from '../../../src/core/model/boardState';

describe('ViolationsPresenter', () => {
  const renderMock = jest.fn();

  const outputAdapter: IOutputAdapter = {
    render: renderMock,
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('renders a single violation message', () => {
    const presenter = new ViolationsPresenter(outputAdapter, VIOLATION_MESSAGES);

    const incorrectMove: IncorrectMove = {
      move: {
        marker: MARKER_X,
        column: 2,
      },
      violations: [RULES_VIOLATIONS.INVALID_PLACEMENT],
    };

    presenter.present(incorrectMove);

    const expectedMessage =
      `Invalid move: ${BOARD_CELL_TO_UI.get(MARKER_X)} at column 2:\n` +
      `- ${VIOLATION_MESSAGES[RULES_VIOLATIONS.INVALID_PLACEMENT]}`;

    expect(renderMock).toHaveBeenCalledWith(expectedMessage);
  });

  test('renders multiple violation messages separated by new lines', () => {
    const presenter = new ViolationsPresenter(outputAdapter, {
      INVALID_PLACEMENT: 'Invalid move',
      INVALID_PLAYER_TURN: 'Invalid player turn',
      // intentionally adding a second violation for test clarity
      // (this keeps the test future-proof)
      OTHER: 'Some other violation',
    } as Record<RuleViolation, string>);

    const incorrectMove: IncorrectMove = {
      move: {
        marker: MARKER_O,
        column: 1,
      },
      violations: ['INVALID_PLACEMENT', 'OTHER'] as RuleViolation[],
    };

    presenter.present(incorrectMove);

    const expectedMessage =
      `Invalid move: ${BOARD_CELL_TO_UI.get(MARKER_O)} at column 1:\n` +
      `- Invalid move\n- Some other violation`;

    expect(renderMock).toHaveBeenCalledWith(expectedMessage);
  });

  test('renders an unknown violation message when no violations are provided', () => {
    const presenter = new ViolationsPresenter(outputAdapter, VIOLATION_MESSAGES);

    const incorrectMove: IncorrectMove = {
      move: {
        marker: MARKER_X,
        column: 0,
      },
      violations: [],
    };

    presenter.present(incorrectMove);

    const expectedMessage =
      `Invalid move: ${BOARD_CELL_TO_UI.get(MARKER_X)} at column 0:\n` + `- unknown violation`;

    expect(renderMock).toHaveBeenCalledWith(expectedMessage);
  });
});
