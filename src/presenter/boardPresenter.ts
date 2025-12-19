import { IOutputAdapter } from '../adapters/outputAdapter';
import { EMPTY_CELL, IBoard } from '../model/board';

export type IBoardPresenter = {
  present(board: IBoard): void;
}

export class BoardPresenter implements IBoardPresenter {
  constructor(private outputAdapter: IOutputAdapter) {}

  public present(board: IBoard): void {
    let output = '';
    let bottom = '';
    for (const row of board) {
      output += '|';
      for (const cell of row) {
        output += '   |' ;
      }
      output += '\n';
      bottom += '---'

    }
    output += bottom + '\n';

    this.outputAdapter.render(output);
  }
}