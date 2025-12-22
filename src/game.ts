import { IBoardConstraints, IBoardState, Move } from './model/boardState';
import { BoardPresentArgs, IOutputPresenter } from './presenter/boardPresenter';
import { GAME_OUTCOME, IGameOutcomeStrategy } from './strategy/game/gameOutcomeStrategy';
import { GameResultPresenterArgs } from './presenter/gameResultPresenter';
import { IncorrectMove, RuleStrategy } from './model/rules';
import { ProposedMove } from './strategy/game/rules/validPlacementStrategy';
import { ITurnState, TurnConstraint } from './model/turnState';

export type IGame = {
  play(): void;
};

export class Game implements IGame {
  constructor(
    private readonly turnState: ITurnState & TurnConstraint,
    private readonly board: IBoardState & IBoardConstraints,
    private readonly boardPresenter: IOutputPresenter<BoardPresentArgs>,
    private readonly helpPresenter: IOutputPresenter<void>,
    private readonly outcomeStrategy: IGameOutcomeStrategy,
    private readonly resultPresenter: IOutputPresenter<GameResultPresenterArgs>,
    private readonly moveChecker: RuleStrategy<ProposedMove>,
    private readonly violationPresenter: IOutputPresenter<IncorrectMove>
  ) {}

  public async play() {
    this.helpPresenter.present();

    while (true) {
      await this.playTurn();

      const outcome = this.outcomeStrategy.determine(this.board.getBoard());

      if (outcome.type !== GAME_OUTCOME.ONGOING) {
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

      const violations = this.moveChecker.check({
        move: proposedMove,
        constraints: this.board,
      });

      if (!violations) {
        break;
      }

      this.violationPresenter.present({ move: proposedMove, violations });
    }

    this.board.addMove(proposedMove);
  }
}
