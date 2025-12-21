import { IBoard, Move, PlayerBoardMarker } from './boardState';
import { IMoveStrategy } from '../strategy/player/cliMoveStrategy';
import { IncorrectMove } from './rules';
import { IOutputPresenter } from '../presenter/boardPresenter';

interface IPlayer {
  getScreenName(): string;

  getNextMove(board: IBoard, marker: PlayerBoardMarker): Promise<Move>;

  notifyInvalidMove(incorrectMove: IncorrectMove): void;
}

export class Player implements IPlayer {
  constructor(
    private readonly name: string,
    private readonly strategy: IMoveStrategy,
    private readonly violationPresenter: IOutputPresenter<IncorrectMove>
  ) {}

  getScreenName(): string {
    return this.name;
  }

  getNextMove(board: IBoard, marker: PlayerBoardMarker): Promise<Move> {
    return this.strategy.createNextMove(board, marker, this.getScreenName());
  }

  notifyInvalidMove(incorrectMove: IncorrectMove): void {
    this.violationPresenter.present(incorrectMove);
  }
}
