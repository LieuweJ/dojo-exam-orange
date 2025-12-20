import { IBoard, IBoardState, MARKER_O, MARKER_X, PlayerBoardMarker } from './model/boardState';
import { IOutputPresenter } from './presenter/output/boardPresenter';
import { IColumnInputHandler } from './handlers/columnInputHandler';
import { Player } from './model/player';

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
    private readonly columnInputHandler: IColumnInputHandler
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

    await this.playTurn();
    this.currentPlayerMarker =
      this.currentPlayerMarker === MARKER_X ? MARKER_O : MARKER_X;
    await this.playTurn();
    this.boardPresenter.present(this.board.getBoard());
  }

  private async playTurn() {
    this.boardPresenter.present(this.board.getBoard());

    this.board.addMove({
      column: await this.columnInputHandler.askFor(
        this.board.getBoard(),
        this.players[this.currentPlayerMarker]
      ),
      marker: this.currentPlayerMarker,
    });
  }
}