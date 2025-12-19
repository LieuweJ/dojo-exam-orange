import { IOutputAdapter } from '../adapters/outputAdapter';
import { IBoard } from '../model/board';

export type IPresenter<T> = {
  present(arg: T): void;
}

export class BoardPresenter implements IPresenter<IBoard> {
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