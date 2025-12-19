import { Game } from './game';
import { Board, MARKER_O, MARKER_X } from './model/board';
import { TerminalOutputAdapter } from './adapters/terminalOutputAdapter';
import { BoardPresenter } from './presenter/output/boardPresenter';
import { RulesPresenter } from './presenter/output/rulesPresenter';
import { TerminalInputAdapter } from './adapters/terminalInputAdapter';
import { ColumnInputHandler } from './handlers/columnInputHandler';
import { AvailableColumnValidator } from './validators/availableColumnValidator';
import { Player } from './model/player';

const RULES_FILE = 'src/docs/rules-of-play.md';

const outputAdapter = new TerminalOutputAdapter();
const inputAdapter = new TerminalInputAdapter();

async function main() {
  const game = new Game(
    {[MARKER_O]: new Player('Player 2'), [MARKER_X]: new Player('Player 1')},
    new Board(),
    new BoardPresenter(outputAdapter),
    new RulesPresenter(outputAdapter, RULES_FILE),
    new ColumnInputHandler(inputAdapter, outputAdapter, new AvailableColumnValidator())
  );

  try {
    await game.play();
  } catch (error) {
    console.error('An error occurred while starting the game:', error);
  } finally {
    inputAdapter.close();
  }
}

main();
