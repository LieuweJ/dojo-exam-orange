import { IBoard, IBoardClass } from './model/board';
import { IPresenter } from './presenter/boardPresenter';
// import { IInputAdapter } from './adapters/inputAdapter';

export type IGame = {
  play(): void;
}

export class Game implements IGame {
  constructor(
    private readonly board: IBoardClass,
    private readonly boardPresenter: IPresenter<IBoard>,
    private readonly helpPresenter: IPresenter<void>,
    // private readonly inputAdapter: IInputAdapter,
  ) {}

  public async play() {
    this.helpPresenter.present()
    this.boardPresenter.present(this.board.getBoard());
    // const column = await this.askForColumn();
  }

  // private async askForColumn(): Promise<number> {
  //   while (true) {
  //     const answer = await this.inputAdapter.ask(
  //       'Player 1, choose a column (1-7): '
  //     );
  //
  //     const column = Number(answer);
  //
  //     if (Number.isInteger(column) && column >= 1 && column <= 7) {
  //       return column;
  //     }
  //
  //     console.log('Invalid input. Please enter a number between 1 and 7.');
  //   }
  // }
}