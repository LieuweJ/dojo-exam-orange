import {
  BoardConstraint,
  BoardState,
  EMPTY_CELL,
  I_EMPTY_CELL,
  IBoard,
  IBoardState,
  MARKER_O,
  MARKER_X,
} from '../model/boardState';
import { ITurnState, TurnConstraint, TurnState } from '../model/turnState';
import { BoardPresentArgs, BoardPresenter, IOutputPresenter } from '../presenter/boardPresenter';
import { GameOutcomeStrategy, IGameOutcomeStrategy } from '../strategy/game/gameOutcomeStrategy';
import { GameResultPresenter, GameResultPresenterArgs } from '../presenter/gameResultPresenter';
import { IRulesChainHandler, RulesChainHandler } from '../strategy/game/rules/rulesChainHandler';
import { IncorrectMove } from '../model/rules';
import {
  GameLifecycleStrategy,
  IGameLifecycleStrategy,
} from '../strategy/game/gameLifecycleStrategy';
import { TerminalInputAdapter } from '../adapters/terminalInputAdapter';
import { TerminalOutputAdapter } from '../adapters/terminalOutputAdapter';
import { CliMoveStrategy } from '../strategy/player/cliMoveStrategy';
import { Player } from '../model/player';
import { HelpPresenter } from '../presenter/helpPresenter';
import { ValidPlacementStrategy } from '../strategy/game/rules/validPlacementStrategy';
import { ValidPlayerTurnStrategy } from '../strategy/game/rules/validPlayerTurnStrategy';
import { VIOLATION_MESSAGES, ViolationsPresenter } from '../presenter/violationsPresenter';

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

  const cliMoveStrategy = new CliMoveStrategy(input, output);

  return {
    inputAdapter: input,
    turnState: new TurnState({
      [MARKER_X]: new Player('Player 1', cliMoveStrategy),
      [MARKER_O]: new Player('Player 2', cliMoveStrategy),
    }),
    boardState: new BoardState(emptyBoard),
    boardPresenter: new BoardPresenter(output),
    helpPresenter: new HelpPresenter(output, HELP_FILE),
    outcomeStrategy: new GameOutcomeStrategy({ connectionLength: 4 }),
    resultPresenter: new GameResultPresenter(new BoardPresenter(output), output),
    rulesChecker: new RulesChainHandler([
      new ValidPlacementStrategy(),
      new ValidPlayerTurnStrategy(),
    ]),
    violationPresenter: new ViolationsPresenter(output, VIOLATION_MESSAGES),
    lifecycleStrategy: new GameLifecycleStrategy(),
  };
}
