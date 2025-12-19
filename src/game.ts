import { IBoard, IBoardClass, MARKER_X, ColumnIndex} from './model/board';
import { IOutputPresenter } from './presenter/output/boardPresenter';
import { IColumnInputHandler } from './handlers/columnInputHandler';

export type IGame = {
  play(): void;
}

export class Game implements IGame {
  constructor(
    private readonly board: IBoardClass,
    private readonly boardPresenter: IOutputPresenter<IBoard>,
    private readonly helpPresenter: IOutputPresenter<void>,
    private readonly columInputHandler: IColumnInputHandler
  ) {}

  public async play() {
    this.helpPresenter.present()
    this.boardPresenter.present(this.board.getBoard());

    const column = await this.columInputHandler.askFor(this.board.getBoard());
    this.board.addMove({column: column as ColumnIndex, marker: MARKER_X});

    this.boardPresenter.present(this.board.getBoard());
  }
}