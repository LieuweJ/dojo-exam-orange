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
import { CliColumnInputResolver } from '../resolvers/cliColumnInputResolver';
import { PositionToOrangeInARowCliResolver } from '../resolvers/positionToOrangeInARowCliResolver';
import { OrangeInARowBoardPresenter } from '../presenter/orangeInARowBoardPresenter';
import { ConnectLineGameOutcomeStrategy } from '../../../sharedMechanics/connectLineGame/strategy/game/connectLineGameOutcomeStrategy';
import {
  GameComposition,
  GameCompositionInput,
} from '../../../game-bootstrap/composition/games-config';

const HELP_FILE = 'docs/orange-in-a-row.md';

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

export function createOrangeInARowComposition({
  inputAdapter,
  outputAdapter,
  playerNames,
}: GameCompositionInput): GameComposition {
  if (playerNames.length !== 2) {
    throw new Error('Orange in a Row requires exactly 2 players.');
  }

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
    inputAdapter,
    outputAdapter,
    ORANGE_IN_A_ROW_BOARD_UI,
    new CliColumnInputResolver()
  );
  const boardPresenter = new OrangeInARowBoardPresenter(outputAdapter, ORANGE_IN_A_ROW_BOARD_UI);

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
    outcomeStrategy: new ConnectLineGameOutcomeStrategy({ connectionLength: 4 }),
    resultPresenter: new GameOutcomePresenter(boardPresenter, outputAdapter),
    rulesChecker: new RulesChainHandler([
      new ValidLineGamePlacementStrategy(),
      new ValidPlayerTurnStrategy(),
    ]),
    violationPresenter: new ViolationsPresenter(
      outputAdapter,
      VIOLATION_MESSAGES,
      ORANGE_IN_A_ROW_BOARD_UI,
      new PositionToOrangeInARowCliResolver()
    ),
    lifecycleStrategy: new GameLifecycleStrategy(),
  };
}
