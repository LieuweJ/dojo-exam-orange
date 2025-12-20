import { IBoard, IBoardState, MARKER_O, MARKER_X, PlayerBoardMarker } from './model/boardState';
import { BoardPresentArgs, IOutputPresenter } from './presenter/boardPresenter';
import { Player } from './model/player';
import { GAME_OUTCOME, IGameOutcomeStrategy } from './strategy/game/gameOutcomeStrategy';
import { GameResultPresenterArgs } from './presenter/gameResultPresenter';

export type IGame = {
  play(): void;
};

export type PlayersByMarker = Record<PlayerBoardMarker, Player>;

export class Game implements IGame {
  currentPlayerMarker: PlayerBoardMarker = MARKER_X;
  players: PlayersByMarker;

  constructor(
    players: PlayersByMarker,
    private readonly board: IBoardState,
    private readonly boardPresenter: IOutputPresenter<BoardPresentArgs>,
    private readonly helpPresenter: IOutputPresenter<void>,
    private readonly outcomeStrategy: IGameOutcomeStrategy,
    private readonly resultPresenter: IOutputPresenter<GameResultPresenterArgs>
  ) {
    if (!players[MARKER_X]) {
      throw new Error(`Player for marker ${MARKER_X.toString()} is missing.`);
    }

    if (!players[MARKER_O]) {
      throw new Error(`Player for marker ${MARKER_O.toString()} is missing.`);
    }

    this.players = players;
  }

  public async play() {
    this.helpPresenter.present();

    while (true) {
      await this.playTurn();

      const outcome = this.outcomeStrategy.determine(this.board.getBoard());

      if (outcome.type !== GAME_OUTCOME.ONGOING) {
        this.resultPresenter.present({
          board: this.board.getBoard(),
          players: this.players,
          outcome
        });

        return;
      }

      this.switchPlayer();
    }
  }

  private async playTurn() {
    this.boardPresenter.present({ board: this.board.getBoard() });

    this.board.addMove(
      await this.players[this.currentPlayerMarker].getNextMove(
        this.board.getBoard(),
        this.currentPlayerMarker
      )
    );
  }

  private switchPlayer() {
    this.currentPlayerMarker =
      this.currentPlayerMarker === MARKER_X ? MARKER_O : MARKER_X;
  }
}