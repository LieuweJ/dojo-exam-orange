import { Game } from './game';
import { BoardState, EMPTY_CELL, IBoard, MARKER_O, MARKER_X } from './model/boardState';
import { TerminalOutputAdapter } from './adapters/terminalOutputAdapter';
import { BoardPresenter } from './presenter/boardPresenter';
import { RulesPresenter } from './presenter/rulesPresenter';
import { TerminalInputAdapter } from './adapters/terminalInputAdapter';
import { CliMoveStrategy } from './strategy/player/cliMoveStrategy';
import { InputOutputValidator } from './validators/inputOutputValidator';
import { Player } from './model/player';
import { GameOutcomeStrategy } from './strategy/game/gameOutcomeStrategy';
import { GameResultPresenter } from './presenter/gameResultPresenter';
import { VIOLATION_MESSAGES, ViolationsPresenter } from './presenter/violationsPresenter';
import { ProposedMoveStrategy } from './strategy/game/proposedMoveStrategy';
import { MoveValidator } from './validators/moveValidator';

const RULES_FILE = 'docs/rules-of-play.md';

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
  const cliStrategy = new CliMoveStrategy(inputAdapter, outputAdapter, new InputOutputValidator());
  const boardPresenter = new BoardPresenter(outputAdapter);
  const violationsPresenter = new ViolationsPresenter(outputAdapter, VIOLATION_MESSAGES);

  const game = new Game(
    {
      [MARKER_O]: new Player('Player 2', cliStrategy, violationsPresenter),
      [MARKER_X]: new Player('Player 1', cliStrategy, violationsPresenter),
    },
    new BoardState(emptyBoard),
    boardPresenter,
    new RulesPresenter(outputAdapter, RULES_FILE),
    new GameOutcomeStrategy({ connectionLength: 4 }),
    new GameResultPresenter(boardPresenter, outputAdapter),
    new ProposedMoveStrategy(new MoveValidator())
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
