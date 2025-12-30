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
import { ConnectLineGameOutcomeStrategy } from '../../../sharedMechanics/connectLineGame/strategy/game/connectLineGameOutcomeStrategy';
import {
  GameComposition,
  GameCompositionInput,
} from '../../../game-bootstrap/composition/games-config';
import { CliTicTacToeInputResolver } from '../resolvers/cliInputResolver';
import { PositionToTicTacToeCliResolver } from '../resolvers/positionToTicTacDojoCliResolver';
import { TicTacDojoBoardPresenter } from '../presenter/ticTacDojoBoardPresenter';
import { IPiece } from '../../../core/model/IPiece';
import { CoinPiece } from '../../../sharedMechanics/connectLineGame/model/coinPiece';
import { ConnectLineMoveHandler } from '../../../sharedMechanics/connectLineGame/handler/connectLineMoveHandler';

const HELP_FILE = 'docs/tic-tac-dojo.md';

const SYMBOL_X = Symbol('x');
const SYMBOL_O = Symbol('o');

export const PIECE_X: IPiece = new CoinPiece(SYMBOL_X);
export const PIECE_O: IPiece = new CoinPiece(SYMBOL_O);

export const TIC_TAC_DOJO_BOARD_UI = new Map<symbol, string>([
  [EMPTY_CELL.getBoardValue(), '·'],
  [PIECE_X.getBoardValue(), '╳'],
  [PIECE_O.getBoardValue(), '○'],
]);

export const TIC_TAC_DOJO_TO_ROW: Record<string, number> = {
  a: 0,
  b: 1,
  c: 2,
};

export type TicTacDojoToRow = typeof TIC_TAC_DOJO_TO_ROW;
export type TicTacDojoRow = TicTacDojoToRow[keyof TicTacDojoToRow];

export const TIC_TAC_DOJO_ROW_TO_STRING = Object.fromEntries(
  Object.entries(TIC_TAC_DOJO_TO_ROW).map(([letter, row]) => [row, letter])
) as Record<TicTacDojoRow, string>;

export type TicTacDojoRowToString = typeof TIC_TAC_DOJO_ROW_TO_STRING;

export function createTicTacDojo({
  inputAdapter,
  outputAdapter,
  playerNames,
}: GameCompositionInput): GameComposition {
  if (playerNames.length !== 2) {
    throw new Error('Orange in a Row requires exactly 2 players.');
  }

  const e: typeof EMPTY_CELL = EMPTY_CELL;

  const emptyBoard: IBoard = [
    [e, e, e],
    [e, e, e],
    [e, e, e],
  ];

  const cliMoveStrategy = new CliMoveStrategy(
    inputAdapter,
    outputAdapter,
    TIC_TAC_DOJO_BOARD_UI,
    new CliTicTacToeInputResolver(TIC_TAC_DOJO_TO_ROW)
  );
  const boardPresenter = new TicTacDojoBoardPresenter(
    outputAdapter,
    TIC_TAC_DOJO_BOARD_UI,
    TIC_TAC_DOJO_ROW_TO_STRING
  );

  return {
    turnState: new TurnState([
      new Player(playerNames[0], cliMoveStrategy, [PIECE_X]),
      new Player(playerNames[1], cliMoveStrategy, [PIECE_O]),
    ]),
    boardState: new BoardState(emptyBoard),
    boardPresenter,
    helpPresenter: new HelpPresenter(outputAdapter, HELP_FILE),
    outcomeStrategy: new ConnectLineGameOutcomeStrategy({ connectionLength: 3 }),
    resultPresenter: new GameOutcomePresenter(boardPresenter, outputAdapter),
    rulesChecker: new RulesChainHandler([
      new ValidLineGamePlacementStrategy(),
      new ValidPlayerTurnStrategy(),
    ]),
    violationPresenter: new ViolationsPresenter(
      outputAdapter,
      CONNECT_LINE_VIOLATION_MESSAGES,
      TIC_TAC_DOJO_BOARD_UI,
      new PositionToTicTacToeCliResolver(TIC_TAC_DOJO_ROW_TO_STRING)
    ),
    lifecycleStrategy: new GameLifecycleStrategy(),
    moveHandler: new ConnectLineMoveHandler(),
  };
}
