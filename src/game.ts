import { BoardConstraint, IBoardState } from './model/boardState';
import { BoardPresentArgs, IOutputPresenter } from './presenter/boardPresenter';
import { IGameOutcomeStrategy } from './strategy/game/gameOutcomeStrategy';
import { GameResultPresenterArgs } from './presenter/gameResultPresenter';
import { IncorrectMove, Move } from './model/rules';
import { ITurnState, TurnConstraint } from './model/turnState';
import { IRulesChainHandler } from './strategy/game/rules/rulesChainHandler';
import { IGameLifecycleStrategy } from './strategy/game/gameLifecycleStrategy';

export type IGame = {
  play(): void;
};

export class Game implements IGame {
  constructor(
    private readonly turnState: ITurnState & TurnConstraint,
    private readonly board: IBoardState & BoardConstraint,
    private readonly boardPresenter: IOutputPresenter<BoardPresentArgs>,
    private readonly helpPresenter: IOutputPresenter<void>,
    private readonly outcomeStrategy: IGameOutcomeStrategy,
    private readonly resultPresenter: IOutputPresenter<GameResultPresenterArgs>,
    private readonly rulesChecker: IRulesChainHandler,
    private readonly violationPresenter: IOutputPresenter<IncorrectMove>,
    private readonly gameLifeCycleStrategy: IGameLifecycleStrategy
  ) {}

  public async play() {
    this.helpPresenter.present();

    while (true) {
      await this.playTurn();

      const outcome = this.outcomeStrategy.determine(this.board.getBoard());

      if (this.gameLifeCycleStrategy.isGameOver(outcome)) {
        this.resultPresenter.present({
          board: this.board.getBoard(),
          players: this.turnState.getPlayers(),
          outcome,
        });

        return;
      }

      this.turnState.nextPlayer();
    }
  }

  private async playTurn() {
    this.boardPresenter.present({ board: this.board.getBoard() });

    let proposedMove: Move;

    while (true) {
      const currentPlayer = this.turnState.getCurrentPlayer();

      proposedMove = await currentPlayer.getNextMove(
        this.board.getBoard(),
        this.turnState.getCurrentPlayerMarker()
      );

      const violations = this.rulesChecker.check({
        move: proposedMove,
        constraints: { ...this.board, ...this.turnState },
      });

      if (!violations) {
        break;
      }

      this.violationPresenter.present({ move: proposedMove, violations });
    }

    this.board.addMove(proposedMove);
  }
}
