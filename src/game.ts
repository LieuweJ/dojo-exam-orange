import { IBoardClass } from './model/board';
import { IBoardPresenter } from './presenter/boardPresenter';

export type IGame = {
  play(): void;
}

export class Game {
  private board: IBoardClass;
  private boardPresenter: IBoardPresenter;

  constructor({board, boardPresenter}: { board: IBoardClass, boardPresenter: IBoardPresenter }) {
    this.board = board;
    this.boardPresenter = boardPresenter;
  }

  public play() {
    this.boardPresenter.present(this.board.getBoard());
  }
}