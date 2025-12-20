import { IBoard, IBoardState, MARKER_O, MARKER_X, PlayerBoardMarker } from './model/boardState';
import { IOutputPresenter } from './presenter/output/boardPresenter';
import { IMoveStrategy } from './strategy/cliMoveStrategy';
import { Player } from './model/player';
import { GAME_OUTCOME, IGameOutcomeStrategy } from './strategy/gameOutcomeStrategy';

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
    private readonly boardPresenter: IOutputPresenter<IBoard>,
    private readonly helpPresenter: IOutputPresenter<void>,
    private readonly columnInputHandler: IMoveStrategy,
    private readonly outcomeStrategy: IGameOutcomeStrategy,
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
        this.boardPresenter.present(this.board.getBoard());
        // later: outcome presenter
        return;
      }

      this.switchPlayer();
    }
  }

  private async playTurn() {
    this.boardPresenter.present(this.board.getBoard());

    this.board.addMove({
      column: await this.columnInputHandler.createNextMove(
        this.board.getBoard(),
        this.players[this.currentPlayerMarker]
      ),
      marker: this.currentPlayerMarker,
    });
  }

  private switchPlayer() {
    this.currentPlayerMarker =
      this.currentPlayerMarker === MARKER_X ? MARKER_O : MARKER_X;
  }
}