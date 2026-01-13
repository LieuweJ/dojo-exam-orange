import { BoardState, EMPTY_CELL, IBoard } from '../../../core/model/boardState';
import { TurnState } from '../../../core/model/turnState';
import { GameOutcomePresenter } from '../../../core/presenter/gameOutcomePresenter';
import { RulesChainHandler } from '../../../core/strategy/game/rules/rulesChainHandler';
import { GameLifecycleStrategy } from '../../../core/strategy/game/gameLifecycleStrategy';
import { Player } from '../../../core/model/player';
import { HelpPresenter } from '../../../core/presenter/helpPresenter';
import { ValidLineGamePlacementStrategy } from '../../../sharedMechanics/connectLineGame/strategy/game/rules/validLineGamePlacementStrategy';
import { ValidPlayerTurnStrategy } from '../../../core/strategy/game/rules/validPlayerTurnStrategy';
import {
  CONNECT_LINE_VIOLATION_MESSAGES,
  ViolationsPresenter,
} from '../../../core/presenter/violationsPresenter';
import { CliMoveStrategy } from '../strategy/player/cliMoveStrategy';
import { CliColumnInputResolver } from '../resolvers/cliColumnInputResolver';
import { PositionToOrangeInARowCliResolver } from '../resolvers/positionToOrangeInARowCliResolver';
import { OrangeInARowBoardPresenter } from '../presenter/orangeInARowBoardPresenter';
import { ConnectLineGameOutcomeStrategy } from '../../../sharedMechanics/connectLineGame/strategy/game/connectLineGameOutcomeStrategy';
import {
  GameComposition,
  GameCompositionInput,
} from '../../../game-bootstrap/composition/games-config';
import { IPiece } from '../../../core/model/IPiece';
import { CoinPiece } from '../../../sharedMechanics/connectLineGame/model/coinPiece';
import { ConnectLineMoveHandler } from '../../../sharedMechanics/connectLineGame/handler/connectLineMoveHandler';

const HELP_FILE = 'docs/orange-in-a-row.md';

const SYMBOL_X = Symbol('x');
const SYMBOL_O = Symbol('o');

export const PIECE_X: IPiece = new CoinPiece(SYMBOL_X);
export const PIECE_O: IPiece = new CoinPiece(SYMBOL_O);

export const ORANGE_IN_A_ROW_BOARD_UI = new Map<symbol, string>([
  [EMPTY_CELL.getBoardValue(), '·'],
  [PIECE_X.getBoardValue(), '●'],
  [PIECE_O.getBoardValue(), '○'],
]);

export const ORANGE_IN_A_ROW_GAME_TYPES = {
  STANDARD: 'standard',
  DEMO: 'demo',
} as const;

export type OrangeInARowGameTypes =
  (typeof ORANGE_IN_A_ROW_GAME_TYPES)[keyof typeof ORANGE_IN_A_ROW_GAME_TYPES];

export function createOrangeInARowComposition({
  inputAdapter,
  outputAdapter,
  playerNames,
  type,
}: GameCompositionInput & {
  type: OrangeInARowGameTypes;
}): GameComposition {
  if (playerNames.length !== 2) {
    throw new Error('Orange in a Row requires exactly 2 players.');
  }

  const startingBoard =
    type === ORANGE_IN_A_ROW_GAME_TYPES.STANDARD ? getEmptyBoard() : getDemoBoard();

  const cliMoveStrategy = new CliMoveStrategy(
    inputAdapter,
    outputAdapter,
    ORANGE_IN_A_ROW_BOARD_UI,
    new CliColumnInputResolver()
  );
  const boardPresenter = new OrangeInARowBoardPresenter(outputAdapter, ORANGE_IN_A_ROW_BOARD_UI);

  return {
    turnState: new TurnState([
      new Player(playerNames[0], cliMoveStrategy, [PIECE_X]),
      new Player(playerNames[1], cliMoveStrategy, [PIECE_O]),
    ]),
    boardState: new BoardState(startingBoard),
    boardPresenter,
    helpPresenter: new HelpPresenter(outputAdapter, HELP_FILE),
    outcomeStrategy: new ConnectLineGameOutcomeStrategy({ connectionLength: 4 }),
    resultPresenter: new GameOutcomePresenter(boardPresenter, outputAdapter),
    rulesChecker: new RulesChainHandler([
      new ValidLineGamePlacementStrategy(),
      new ValidPlayerTurnStrategy(),
    ]),
    violationPresenter: new ViolationsPresenter(
      outputAdapter,
      CONNECT_LINE_VIOLATION_MESSAGES,
      ORANGE_IN_A_ROW_BOARD_UI,
      new PositionToOrangeInARowCliResolver()
    ),
    lifecycleStrategy: new GameLifecycleStrategy(),
    moveHandler: new ConnectLineMoveHandler(),
  };
}

function getEmptyBoard(): IBoard {
  const e: typeof EMPTY_CELL = EMPTY_CELL;

  return [
    [e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e],
    [e, e, e, e, e, e, e],
  ];
}

function getDemoBoard(): IBoard {
  const E: typeof EMPTY_CELL = EMPTY_CELL;
  const X: typeof PIECE_X = PIECE_X;
  const O: typeof PIECE_O = PIECE_O;

  return [
    [E, E, E, E, E, E, E],
    [E, E, E, E, E, E, E],
    [E, E, E, X, E, E, E],
    [E, E, O, X, E, E, E],
    [E, O, X, O, E, E, E],
    [O, X, O, X, O, E, E],
  ];
}
