import { Game } from '../src/game';
import { Board, IBoardClass, IBoard } from '../src/model/board';
import { IPresenter } from '../src/presenter/boardPresenter';

describe('A game of orange-in-a-row can be played', () => {
  let board: IBoardClass;
  let boardPresenterSpy: jest.Mocked<IPresenter<IBoard>>;
  let helpPresenterSpy: jest.Mocked<IPresenter<void>>;
  let game: Game;

  beforeEach(() => {
    board = new Board();

    boardPresenterSpy = {
      present: jest.fn(),
    };

    helpPresenterSpy = {
      present: jest.fn(),
    };

    game = new Game(
      board,
      boardPresenterSpy,
      helpPresenterSpy,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('new game presents the rules and the initial board', () => {
    game.play();

    expect(helpPresenterSpy.present).toHaveBeenCalledTimes(1);
    expect(boardPresenterSpy.present).toHaveBeenCalledWith(
      board.getBoard(),
    );
  });
});