import {
  BoardCell,
  BoardConstraint,
  BoardState,
  EMPTY_CELL,
  IBoard,
  IBoardState,
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
  GameOutcomePresenter,
  GameResultPresenterArgs,
} from '../core/presenter/gameOutcomePresenter';
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
import { Piece, Player } from '../core/model/player';
import { HelpPresenter } from '../core/presenter/helpPresenter';
import { ValidPlacementStrategy } from '../core/strategy/game/rules/validPlacementStrategy';
import { ValidPlayerTurnStrategy } from '../core/strategy/game/rules/validPlayerTurnStrategy';
import { VIOLATION_MESSAGES, ViolationsPresenter } from '../core/presenter/violationsPresenter';
import { CliMoveStrategy } from '../orange-in-a-row/strategy/player/cli-move-strategy';
import { CliPositionResolver } from '../orange-in-a-row/resolvers/cli-position-resolver';
import { PositionToOrangeInARowCliResolver } from '../orange-in-a-row/resolvers/position-to-orange-in-a-row-cli-resolver';

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

export const PIECE_X: Piece = {
  boardValue: Symbol('x'),
};

export const PIECE_O: Piece = {
  boardValue: Symbol('o'),
};

export const ORANGE_IN_A_ROW_BOARD_UI = new Map<BoardCell, string>([
  [EMPTY_CELL, '·'],
  [PIECE_X, '●'],
  [PIECE_O, '○'],
]);

export function createOrangeInARowComposition(): GameComposition {
  const input = new TerminalInputAdapter();
  const output = new TerminalOutputAdapter();

  const e: typeof EMPTY_CELL = EMPTY_CELL;

  const emptyBoard: IBoard = [
    [e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e],
  ];

  const cliMoveStrategy = new CliMoveStrategy(
    input,
    output,
    ORANGE_IN_A_ROW_BOARD_UI,
    new CliPositionResolver()
  );
  const boardPresenter = new BoardPresenter(output, ORANGE_IN_A_ROW_BOARD_UI);

  return {
    inputAdapter: input,
    turnState: new TurnState({
      players: [
        new Player('Player 1', cliMoveStrategy, [PIECE_X]),
        new Player('Player 2', cliMoveStrategy, [PIECE_O]),
      ],
    }),
    boardState: new BoardState(emptyBoard),
    boardPresenter,
    helpPresenter: new HelpPresenter(output, HELP_FILE),
    outcomeStrategy: new GameOutcomeStrategy({ connectionLength: 4 }),
    resultPresenter: new GameOutcomePresenter(boardPresenter, output),
    rulesChecker: new RulesChainHandler([
      new ValidPlacementStrategy(),
      new ValidPlayerTurnStrategy(),
    ]),
    violationPresenter: new ViolationsPresenter(
      output,
      VIOLATION_MESSAGES,
      ORANGE_IN_A_ROW_BOARD_UI,
      new PositionToOrangeInARowCliResolver()
    ),
    lifecycleStrategy: new GameLifecycleStrategy(),
  };
}
