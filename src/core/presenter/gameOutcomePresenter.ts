import { IBoard } from '../model/boardState';
import { GAME_OUTCOME, GameOutcome } from '../strategy/game/gameOutcomeStrategy';
import { IOutputAdapter } from '../adapters/terminalOutputAdapter';
import { BoardPresentArgs, IOutputPresenter } from './boardPresenter';
import { IPlayer } from '../model/player';
import { IGameHistory } from '../model/gameHistory';

export type GameResultPresenterArgs = {
  board: IBoard;
  outcome: GameOutcome;
  players: IPlayer[];
  history: IGameHistory;
};

export class GameOutcomePresenter implements IOutputPresenter<GameResultPresenterArgs> {
  constructor(
    private readonly boardPresenter: IOutputPresenter<BoardPresentArgs>,
    private readonly output: IOutputAdapter
  ) {}

  present({ board, players, outcome, history }: GameResultPresenterArgs): void {
    const moves = history.getRecordedMoves();
    const movesDescription = `After ${moves.length} move${moves.length !== 1 ? 's' : ''}`;

    if (outcome.type === GAME_OUTCOME.WIN) {
      this.boardPresenter.present({
        board,
        highlightPositions: outcome.winningPositions,
        players,
      });

      this.output.render(`${movesDescription}, ${outcome.winner.getScreenName()} wins!`);

      return;
    }

    if (outcome.type === GAME_OUTCOME.DRAW) {
      this.boardPresenter.present({ board, players });
      this.output.render(`${movesDescription}, it's a draw.`);
    }
  }
}
