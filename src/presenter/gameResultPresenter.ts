import { IBoard } from '../model/boardState';
import { GAME_OUTCOME, GameOutcome } from '../strategy/game/gameOutcomeStrategy';
import { IOutputAdapter } from '../adapters/terminalOutputAdapter';
import { BOARD_CELL_TO_UI, BoardPresentArgs, BoardPresenter, IOutputPresenter } from './boardPresenter';
import { PlayersByMarker } from '../game';

export type GameResultPresenterArgs = {
  board: IBoard;
  players: PlayersByMarker;
  outcome: GameOutcome;
}

export class GameResultPresenter implements IOutputPresenter<GameResultPresenterArgs> {
  constructor(
    private readonly boardPresenter: IOutputPresenter<BoardPresentArgs>,
    private readonly output: IOutputAdapter
  ) {}

  present({board, players, outcome}: GameResultPresenterArgs): void {
    if (outcome.type === GAME_OUTCOME.WIN) {
      const winningPlayer = players[outcome.winner];

      this.boardPresenter.present({
        board,
        highlightPositions: outcome.winningPositions
      });

      this.output.render(`${winningPlayer.getScreenName()} (${BOARD_CELL_TO_UI.get(outcome.winner)}) wins!`);

      return;
    }

    if (outcome.type === GAME_OUTCOME.DRAW) {
      this.boardPresenter.present({ board });
      this.output.render(`It's a draw.`);
    }
  }
}