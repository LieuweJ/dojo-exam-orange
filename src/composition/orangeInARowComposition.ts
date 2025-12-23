import {
  BoardCell,
  BoardConstraint,
  BoardState,
  EMPTY_CELL,
  I_EMPTY_CELL,
  IBoard,
  IBoardState,
  MARKER_O,
  MARKER_X,
} from '../core/model/boardState';
import { ITurnState, TurnConstraint, TurnState } from '../core/model/turnState';
import {
  BoardPresentArgs,
  BoardPresenter,
  IOutputPresenter,
} from '../core/presenter/boardPresenter';
import {
  GameOutcomeStrategy,
  IGameOutcomeStrategy,
} from '../core/strategy/game/gameOutcomeStrategy';
import {
  GameResultPresenter,
  GameResultPresenterArgs,
} from '../core/presenter/gameResultPresenter';
import {
  IRulesChainHandler,
  RulesChainHandler,
} from '../core/strategy/game/rules/rulesChainHandler';
import { IncorrectMove } from '../core/model/rules';
import {
  GameLifecycleStrategy,
  IGameLifecycleStrategy,
} from '../core/strategy/game/gameLifecycleStrategy';
import { TerminalInputAdapter } from '../core/adapters/terminalInputAdapter';
import { TerminalOutputAdapter } from '../core/adapters/terminalOutputAdapter';
import { CliMoveStrategy } from '../core/strategy/player/cliMoveStrategy';
import { Player } from '../core/model/player';
import { HelpPresenter } from '../core/presenter/helpPresenter';
import { ValidPlacementStrategy } from '../core/strategy/game/rules/validPlacementStrategy';
import { ValidPlayerTurnStrategy } from '../core/strategy/game/rules/validPlayerTurnStrategy';
import { VIOLATION_MESSAGES, ViolationsPresenter } from '../core/presenter/violationsPresenter';

export type GameComposition = {
  turnState: ITurnState & TurnConstraint;
  boardState: IBoardState & BoardConstraint;
  boardPresenter: IOutputPresenter<BoardPresentArgs>;
  helpPresenter: IOutputPresenter<void>;
  outcomeStrategy: IGameOutcomeStrategy;
  resultPresenter: IOutputPresenter<GameResultPresenterArgs>;
  rulesChecker: IRulesChainHandler;
  violationPresenter: IOutputPresenter<IncorrectMove>;
  lifecycleStrategy: IGameLifecycleStrategy;
  inputAdapter: TerminalInputAdapter;
};

const HELP_FILE = 'docs/rules-of-play.md';

export const ORANGE_IN_A_ROW_BOARD_UI = new Map<BoardCell, string>([
  [EMPTY_CELL, '·'],
  [MARKER_X, '●'],
  [MARKER_O, '○'],
]);

export function createOrangeInARowComposition(): GameComposition {
  const input = new TerminalInputAdapter();
  const output = new TerminalOutputAdapter();

  const e: I_EMPTY_CELL = EMPTY_CELL;

  const emptyBoard: IBoard = [
    [e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e],
  ];

  const cliMoveStrategy = new CliMoveStrategy(input, output, ORANGE_IN_A_ROW_BOARD_UI);
  const boardPresenter = new BoardPresenter(output, ORANGE_IN_A_ROW_BOARD_UI);

  return {
    inputAdapter: input,
    turnState: new TurnState({
      [MARKER_X]: new Player('Player 1', cliMoveStrategy),
      [MARKER_O]: new Player('Player 2', cliMoveStrategy),
    }),
    boardState: new BoardState(emptyBoard),
    boardPresenter,
    helpPresenter: new HelpPresenter(output, HELP_FILE),
    outcomeStrategy: new GameOutcomeStrategy({ connectionLength: 4 }),
    resultPresenter: new GameResultPresenter(boardPresenter, output, ORANGE_IN_A_ROW_BOARD_UI),
    rulesChecker: new RulesChainHandler([
      new ValidPlacementStrategy(),
      new ValidPlayerTurnStrategy(),
    ]),
    violationPresenter: new ViolationsPresenter(
      output,
      VIOLATION_MESSAGES,
      ORANGE_IN_A_ROW_BOARD_UI
    ),
    lifecycleStrategy: new GameLifecycleStrategy(),
  };
}
