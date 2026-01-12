import { TerminalInputAdapter } from './core/adapters/terminalInputAdapter';
import { TerminalOutputAdapter } from './core/adapters/terminalOutputAdapter';
import { createGameFromUserSelection } from './game-bootstrap/createGameFromUserSelection';

async function main() {
  const inputAdapter = new TerminalInputAdapter();
  const outputAdapter = new TerminalOutputAdapter();

  try {
    const game = await createGameFromUserSelection({ inputAdapter, outputAdapter });

    if (!game) {
      outputAdapter.render('\nOtsukaresama deshita!\n');
      return;
    }

    await game.play();
  } catch (error) {
    outputAdapter.render('An unexpected error occurred.');
    console.error(error);
  } finally {
    inputAdapter.close();
  }
}

main();
