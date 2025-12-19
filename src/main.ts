import { Game } from './game';
import { Board } from './model/board';
import { TerminalOutputAdapter } from './adapters/terminalOutputAdapter';
import { BoardPresenter } from './presenter/output/boardPresenter';
import { RulesPresenter } from './presenter/output/rulesPresenter';
import { TerminalInputAdapter } from './adapters/terminalInputAdapter';
import { ColumnInputHandler } from './handlers/columnInputHandler';

const RULES_FILE = 'src/docs/rules-of-play.md';

const outputAdapter = new TerminalOutputAdapter();
const inputAdapter = new TerminalInputAdapter();

async function main() {
  const game = new Game(
    new Board(),
    new BoardPresenter(outputAdapter),
    new RulesPresenter(outputAdapter, RULES_FILE),
    new ColumnInputHandler(inputAdapter)
  );

  try {
    await game.play();
  } catch (error) {
    console.error('An error occurred while starting the game:', error);
  } finally {
    inputAdapter.close();
  }
}

main()


