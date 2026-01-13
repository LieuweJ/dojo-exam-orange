import { createOrangeInARowComposition } from '../../games/orange-in-a-row/composition/orangeInARowComposition';
import { IInputAdapter } from '../../core/adapters/terminalInputAdapter';
import { ITurnState } from '../../core/model/turnState';
import { IBoardState } from '../../core/model/boardState';
import { BoardPresentArgs, IOutputPresenter } from '../../core/presenter/boardPresenter';
import { IGameOutcomeStrategy } from '../../core/strategy/game/gameOutcomeStrategy';
import { GameResultPresenterArgs } from '../../core/presenter/gameOutcomePresenter';
import { IRulesChainHandler } from '../../core/strategy/game/rules/rulesChainHandler';
import { BaseRuleViolationType, IncorrectMove } from '../../core/model/rules';
import { IGameLifecycleStrategy } from '../../core/strategy/game/gameLifecycleStrategy';
import { IOutputAdapter } from '../../core/adapters/terminalOutputAdapter';
import { createTicTacDojo } from '../../games/tic-tac-dojo/composition/ticTacDojoComposition';
import { IPiece } from '../../core/model/IPiece';
import { IMoveHandler } from '../../core/handler/MoveHandler';
import {
  CHESS_GAME_TYPES,
  createChessComposition,
} from '../../games/scacchi-con-dojo/composition/chessComposition';

export type GameCompositionInput = {
  inputAdapter: IInputAdapter;
  outputAdapter: IOutputAdapter;
  playerNames: string[];
};

export type GameComposition = {
  turnState: ITurnState;
  boardState: IBoardState;
  boardPresenter: IOutputPresenter<BoardPresentArgs>;
  helpPresenter: IOutputPresenter<void>;
  outcomeStrategy: IGameOutcomeStrategy;
  resultPresenter: IOutputPresenter<GameResultPresenterArgs>;
  rulesChecker: IRulesChainHandler;
  violationPresenter: IOutputPresenter<IncorrectMove<BaseRuleViolationType>>;
  lifecycleStrategy: IGameLifecycleStrategy;
  moveHandler: IMoveHandler<IPiece>;
};

export type GameDescriptor = {
  id: string;
  displayName: string;
  requiredPlayers: number;
  createComposition: (input: GameCompositionInput) => GameComposition;
};

export const LISTED_GAMES: GameDescriptor[] = [
  {
    id: 'orange-in-a-row',
    displayName: 'Orange in a Row',
    requiredPlayers: 2,
    createComposition: createOrangeInARowComposition,
  },
  {
    id: 'tic-tac-dojo',
    displayName: 'Tic Tac Dojo',
    requiredPlayers: 2,
    createComposition: createTicTacDojo,
  },
  {
    id: 'scacchi-con-dojo',
    displayName: 'Scacchi con Dojo',
    requiredPlayers: 2,
    createComposition: (args) =>
      createChessComposition({ ...args, ...{ type: CHESS_GAME_TYPES.STANDARD } }),
  },
];

export const UNLISTED_GAMES: Map<string, GameDescriptor> = new Map([
  [
    'secret demo',
    {
      id: 'scacchi-con-dojo',
      displayName: 'Scacchi con Dojo',
      requiredPlayers: 2,
      createComposition: (args) =>
        createChessComposition({ ...args, ...{ type: CHESS_GAME_TYPES.DEMO } }),
    },
  ],
]);
