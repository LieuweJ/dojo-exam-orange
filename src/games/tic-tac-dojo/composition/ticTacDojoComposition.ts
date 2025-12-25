import { BoardCell, BoardState, EMPTY_CELL, IBoard } from '../../../core/model/boardState';
import { TurnState } from '../../../core/model/turnState';
import { GameOutcomePresenter } from '../../../core/presenter/gameOutcomePresenter';
import { RulesChainHandler } from '../../../core/strategy/game/rules/rulesChainHandler';
import { GameLifecycleStrategy } from '../../../core/strategy/game/gameLifecycleStrategy';
import { Piece, Player } from '../../../core/model/player';
import { HelpPresenter } from '../../../core/presenter/helpPresenter';
import { ValidLineGamePlacementStrategy } from '../../../sharedMechanics/connectLineGame/strategy/game/rules/validLineGamePlacementStrategy';
import { ValidPlayerTurnStrategy } from '../../../core/strategy/game/rules/validPlayerTurnStrategy';
import {
  VIOLATION_MESSAGES,
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

const HELP_FILE = 'docs/tic-tac-dojo.md';

export const PIECE_X: Piece = {
  boardValue: Symbol('x'),
};

export const PIECE_O: Piece = {
  boardValue: Symbol('o'),
};

export const TIC_TAC_DOJO_BOARD_UI = new Map<BoardCell, string>([
  [EMPTY_CELL, '·'],
  [PIECE_X, '╳'],
  [PIECE_O, '○'],
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
    turnState: new TurnState({
      players: [
        new Player(playerNames[0], cliMoveStrategy, [PIECE_X]),
        new Player(playerNames[1], cliMoveStrategy, [PIECE_O]),
      ],
    }),
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
      VIOLATION_MESSAGES,
      TIC_TAC_DOJO_BOARD_UI,
      new PositionToTicTacToeCliResolver(TIC_TAC_DOJO_ROW_TO_STRING)
    ),
    lifecycleStrategy: new GameLifecycleStrategy(),
  };
}
