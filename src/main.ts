import { createOrangeInARowComposition } from './composition/orangeInARowComposition';
import { Game } from './game';

async function main() {
  const {
    inputAdapter,
    boardState,
    turnState,
    boardPresenter,
    helpPresenter,
    outcomeStrategy,
    resultPresenter,
    rulesChecker,
    violationPresenter,
    lifecycleStrategy,
  } = createOrangeInARowComposition();

  const game = new Game(
    turnState,
    boardState,
    boardPresenter,
    helpPresenter,
    outcomeStrategy,
    resultPresenter,
    rulesChecker,
    violationPresenter,
    lifecycleStrategy
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
