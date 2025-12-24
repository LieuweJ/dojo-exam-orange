import { IBoard } from '../model/boardState';
import { GAME_OUTCOME, GameOutcome } from '../strategy/game/gameOutcomeStrategy';
import { IOutputAdapter } from '../adapters/terminalOutputAdapter';
import { BoardPresentArgs, IOutputPresenter } from './boardPresenter';

export type GameResultPresenterArgs = {
  board: IBoard;
  outcome: GameOutcome;
};

export class GameOutcomePresenter implements IOutputPresenter<GameResultPresenterArgs> {
  constructor(
    private readonly boardPresenter: IOutputPresenter<BoardPresentArgs>,
    private readonly output: IOutputAdapter
  ) {}

  present({ board, outcome }: GameResultPresenterArgs): void {
    if (outcome.type === GAME_OUTCOME.WIN) {
      this.boardPresenter.present({
        board,
        highlightPositions: outcome.winningPositions,
      });

      this.output.render(`${outcome.winner.getScreenName()} wins!`);

      return;
    }

    if (outcome.type === GAME_OUTCOME.DRAW) {
      this.boardPresenter.present({ board });
      this.output.render(`It's a draw.`);
    }
  }
}
