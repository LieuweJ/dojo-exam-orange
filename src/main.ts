import { Game } from './game';
import { Board } from './model/board';
import { OutputAdapter } from './adapters/outputAdapter';
import { BoardPresenter } from './presenter/boardPresenter';
import { RulesPresenter } from './presenter/rulesPresenter';
// import { InputAdapter } from './adapters/inputAdapter';

const RULES_FILE = 'src/docs/rules-of-play.md';

const outputAdapter = new OutputAdapter();
// const inputAdapter = new InputAdapter();

async function main() {
  const game = new Game(
    new Board(),
    new BoardPresenter(outputAdapter),
    new RulesPresenter(outputAdapter, RULES_FILE),
    // inputAdapter
  );

  try {
    await game.play();
  } catch (error) {
    console.error('An error occurred while starting the game:', error);
  } finally {
    // inputAdapter.close();
  }
}

main()


