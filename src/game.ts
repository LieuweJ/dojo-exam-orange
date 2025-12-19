import { IBoard, IBoardClass } from './model/board';
import { IPresenter } from './presenter/boardPresenter';

export type IGame = {
  play(): void;
}

export class Game implements IGame {
  constructor(
    private readonly board: IBoardClass,
    private readonly boardPresenter: IPresenter<IBoard>,
    private readonly helpPresenter: IPresenter<void>,
  ) {}

  public play() {
    this.helpPresenter.present()
    this.boardPresenter.present(this.board.getBoard());
  }
}