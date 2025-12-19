import { Game } from './game';
import { Board } from './model/board';
import { OutputAdapter } from './adapters/outputAdapter';
import { BoardPresenter } from './presenter/boardPresenter';
import { RulesPresenter } from './presenter/rulesPresenter';

const RULES_FILE = 'src/docs/rules-of-play.md';

const outputAdapter = new OutputAdapter();

const game = new Game(
  new Board(),
  new BoardPresenter(outputAdapter),
  new RulesPresenter(outputAdapter, RULES_FILE),
);

game.play();

