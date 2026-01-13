import { IBoardState } from './model/boardState';
import { BoardPresentArgs, IOutputPresenter } from './presenter/boardPresenter';
import { IGameOutcomeStrategy } from './strategy/game/gameOutcomeStrategy';
import { GameResultPresenterArgs } from './presenter/gameOutcomePresenter';
import { BaseRuleViolationType, IncorrectMove, Move } from './model/rules';
import { ITurnState } from './model/turnState';
import { IRulesChainHandler } from './strategy/game/rules/rulesChainHandler';
import { IGameLifecycleStrategy } from './strategy/game/gameLifecycleStrategy';
import { IMoveHandler } from './handler/MoveHandler';
import { IPiece } from './model/IPiece';

export type IGame = {
  play(): void;
};

export class Game implements IGame {
  constructor(
    private readonly turnState: ITurnState,
    private readonly boardState: IBoardState,
    private readonly boardPresenter: IOutputPresenter<BoardPresentArgs>,
    private readonly helpPresenter: IOutputPresenter<void>,
    private readonly outcomeStrategy: IGameOutcomeStrategy,
    private readonly resultPresenter: IOutputPresenter<GameResultPresenterArgs>,
    private readonly rulesChecker: IRulesChainHandler,
    private readonly violationPresenter: IOutputPresenter<IncorrectMove<BaseRuleViolationType>>,
    private readonly gameLifeCycleStrategy: IGameLifecycleStrategy,
    private readonly moveHandler: IMoveHandler<IPiece>
  ) {}

  public async play() {
    this.helpPresenter.present();

    while (true) {
      await this.playTurn();

      const players = this.turnState.getPlayers();

      const outcome = this.outcomeStrategy.determine(this.boardState.getBoard(), players);

      if (this.gameLifeCycleStrategy.isGameOver(outcome)) {
        this.resultPresenter.present({
          board: this.boardState.getBoard(),
          players,
          outcome,
        });

        return;
      }

      this.turnState.nextPlayer();
    }
  }

  private async playTurn() {
    this.boardPresenter.present({
      board: this.boardState.getBoard(),
      players: this.turnState.getPlayers(),
    });

    let proposedMove: Move;

    while (true) {
      const currentPlayer = this.turnState.getCurrentPlayer();

      proposedMove = await currentPlayer.getNextMove(
        this.boardState.getBoard(),
        this.turnState.getPlayers()
      );

      const violations = this.rulesChecker.check({
        move: proposedMove,
        moveContext: {
          board: this.boardState,
          turn: this.turnState,
        },
      });

      if (!violations) {
        break;
      }

      this.boardPresenter.present({
        board: this.boardState.getBoard(),
        players: this.turnState.getPlayers(),
      });

      this.violationPresenter.present({ move: proposedMove, violations });
    }

    this.moveHandler.handle(proposedMove, this.boardState, this.turnState.getCurrentPlayer());
  }
}
