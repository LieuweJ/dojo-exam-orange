import { Game } from './game';
import { BoardState, EMPTY_CELL, IBoard, MARKER_O, MARKER_X } from './model/boardState';
import { TerminalOutputAdapter } from './adapters/terminalOutputAdapter';
import { BoardPresenter } from './presenter/boardPresenter';
import { RulesPresenter } from './presenter/rulesPresenter';
import { TerminalInputAdapter } from './adapters/terminalInputAdapter';
import { CliMoveStrategy } from './strategy/player/cliMoveStrategy';
import { AvailableColumnValidator } from './validators/availableColumnValidator';
import { Player } from './model/player';
import { GameOutcomeStrategy } from './strategy/game/gameOutcomeStrategy';
import { GameResultPresenter } from './presenter/gameResultPresenter';

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
  const cliStrategy = new CliMoveStrategy(inputAdapter, outputAdapter, new AvailableColumnValidator());
  const boardPresenter = new BoardPresenter(outputAdapter);

  const game = new Game(
    {
      [MARKER_O]: new Player('Player 2', cliStrategy),
      [MARKER_X]: new Player('Player 1', cliStrategy)
    },
    new BoardState(emptyBoard),
    boardPresenter,
    new RulesPresenter(outputAdapter, RULES_FILE),
    new GameOutcomeStrategy({ connectionLength: 4 }),
    new GameResultPresenter(boardPresenter, outputAdapter)
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
