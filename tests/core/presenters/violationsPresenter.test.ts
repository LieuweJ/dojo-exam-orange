import { IOutputAdapter } from '../../../src/core/adapters/terminalOutputAdapter';
import {
  VIOLATION_MESSAGES,
  ViolationsPresenter,
} from '../../../src/core/presenter/violationsPresenter';
import { IncorrectMove, RULES_VIOLATIONS, RuleViolation } from '../../../src/core/model/rules';
import {
  ORANGE_IN_A_ROW_BOARD_UI,
  PIECE_O,
  PIECE_X,
} from '../../../src/composition/orangeInARowComposition';

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
    const presenter = new ViolationsPresenter(
      outputAdapter,
      VIOLATION_MESSAGES,
      ORANGE_IN_A_ROW_BOARD_UI
    );

    const incorrectMove: IncorrectMove = {
      move: {
        piece: PIECE_X,
        position: { column: 2, row: 0 },
      },
      violations: [RULES_VIOLATIONS.INVALID_PLACEMENT],
    };

    presenter.present(incorrectMove);

    const expectedMessage =
      `Invalid move: ${ORANGE_IN_A_ROW_BOARD_UI.get(PIECE_X)} at column 2:\n` +
      `- ${VIOLATION_MESSAGES[RULES_VIOLATIONS.INVALID_PLACEMENT]}`;

    expect(renderMock).toHaveBeenCalledWith(expectedMessage);
  });

  test('renders multiple violation messages separated by new lines', () => {
    const presenter = new ViolationsPresenter(
      outputAdapter,
      {
        INVALID_PLACEMENT: 'Invalid move',
        INVALID_PLAYER_TURN: 'Invalid player turn',
        // intentionally adding a second violation for test clarity
        // (this keeps the test future-proof)
        OTHER: 'Some other violation',
      } as Record<RuleViolation, string>,
      ORANGE_IN_A_ROW_BOARD_UI
    );

    const incorrectMove: IncorrectMove = {
      move: {
        piece: PIECE_O,
        position: { column: 1, row: 0 },
      },
      violations: ['INVALID_PLACEMENT', 'OTHER'] as RuleViolation[],
    };

    presenter.present(incorrectMove);

    const expectedMessage =
      `Invalid move: ${ORANGE_IN_A_ROW_BOARD_UI.get(PIECE_O)} at column 1:\n` +
      `- Invalid move\n- Some other violation`;

    expect(renderMock).toHaveBeenCalledWith(expectedMessage);
  });

  test('renders an unknown violation message when no violations are provided', () => {
    const presenter = new ViolationsPresenter(
      outputAdapter,
      VIOLATION_MESSAGES,
      ORANGE_IN_A_ROW_BOARD_UI
    );

    const incorrectMove: IncorrectMove = {
      move: {
        piece: PIECE_X,
        position: { column: 0, row: 0 },
      },
      violations: [],
    };

    presenter.present(incorrectMove);

    const expectedMessage =
      `Invalid move: ${ORANGE_IN_A_ROW_BOARD_UI.get(PIECE_X)} at column 0:\n` +
      `- unknown violation`;

    expect(renderMock).toHaveBeenCalledWith(expectedMessage);
  });
});
