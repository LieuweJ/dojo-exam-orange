import { Game } from './game';
import { Board } from './model/board';
import { OutputAdapter } from './adapters/outputAdapter';
import { BoardPresenter } from './presenter/boardPresenter';

const game = new Game(
  {
    board: new Board(),
    boardPresenter: new BoardPresenter(new OutputAdapter()),
  }
);

game.play();

