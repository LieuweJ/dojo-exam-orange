import { Game } from './game';
import { BoardState, EMPTY_CELL, IBoard, MARKER_O, MARKER_X } from './model/boardState';
import { TerminalOutputAdapter } from './adapters/terminalOutputAdapter';
import { BoardPresenter } from './presenter/output/boardPresenter';
import { RulesPresenter } from './presenter/output/rulesPresenter';
import { TerminalInputAdapter } from './adapters/terminalInputAdapter';
import { ColumnInputHandler } from './handlers/columnInputHandler';
import { AvailableColumnValidator } from './validators/availableColumnValidator';
import { Player } from './model/player';
import { GameOutcomeStrategy } from './strategy/gameOutcomeStrategy';

const RULES_FILE = 'src/docs/rules-of-play.md';

const outputAdapter = new TerminalOutputAdapter();
const inputAdapter = new TerminalInputAdapter();

const emptyBoard: IBoard = [
  [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
  [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
  [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
  [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
  [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
  [EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL, EMPTY_CELL],
];

async function main() {
  const game = new Game(
    {[MARKER_O]: new Player('Player 2'), [MARKER_X]: new Player('Player 1')},
    new BoardState(emptyBoard),
    new BoardPresenter(outputAdapter),
    new RulesPresenter(outputAdapter, RULES_FILE),
    new ColumnInputHandler(inputAdapter, outputAdapter, new AvailableColumnValidator()),
    new GameOutcomeStrategy({ connectionLength: 4 })
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
