import { IBoard } from '../model/boardState';
import { GAME_OUTCOME, GameOutcome } from '../strategy/game/gameOutcomeStrategy';
import { IOutputAdapter } from '../adapters/terminalOutputAdapter';
import { BoardPresentArgs, IOutputPresenter } from './boardPresenter';
import { IPlayer } from '../model/player';

export type GameResultPresenterArgs = {
  board: IBoard;
  outcome: GameOutcome;
  players: IPlayer[];
};

export class GameOutcomePresenter implements IOutputPresenter<GameResultPresenterArgs> {
  constructor(
    private readonly boardPresenter: IOutputPresenter<BoardPresentArgs>,
    private readonly output: IOutputAdapter
  ) {}

  present({ board, players, outcome }: GameResultPresenterArgs): void {
    if (outcome.type === GAME_OUTCOME.WIN) {
      this.boardPresenter.present({
        board,
        highlightPositions: outcome.winningPositions,
        players,
      });

      this.output.render(`${outcome.winner.getScreenName()} wins!`);

      return;
    }

    if (outcome.type === GAME_OUTCOME.DRAW) {
      this.boardPresenter.present({ board, players });
      this.output.render(`It's a draw.`);
    }
  }
}
