import { Game } from '../src/game';
import { Board, IBoardClass, IBoard } from '../src/model/board';
import { IOutputPresenter } from '../src/presenter/output/boardPresenter';
import { IColumnInputHandler } from '../src/handlers/columnInputHandler';

describe('A game of orange-in-a-row can be played', () => {
  let board: IBoardClass;
  let boardPresenterSpy: jest.Mocked<IOutputPresenter<IBoard>>;
  let helpPresenterSpy: jest.Mocked<IOutputPresenter<void>>;
  let game: Game;
  let columnInputHandlerSpy: jest.Mocked<IColumnInputHandler>;

  beforeEach(() => {
    board = new Board();

    boardPresenterSpy = {
      present: jest.fn(),
    };

    helpPresenterSpy = {
      present: jest.fn(),
    };

    columnInputHandlerSpy = {
      askFor: jest.fn(),
    };

    game = new Game(
      board,
      boardPresenterSpy,
      helpPresenterSpy,
      columnInputHandlerSpy
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('new game presents the rules and the initial board', () => {
    columnInputHandlerSpy.askFor.mockResolvedValueOnce(4);

    game.play();

    expect(helpPresenterSpy.present).toHaveBeenCalledTimes(1);
    expect(boardPresenterSpy.present).toHaveBeenCalledWith(
      board.getBoard(),
    );
  });

  test('Board displays coins with correct colors for each player', () => {
    columnInputHandlerSpy.askFor.mockResolvedValueOnce(4);
    game.play();

    expect(helpPresenterSpy.present).toHaveBeenCalledTimes(1);
    expect(boardPresenterSpy.present).toHaveBeenCalledWith(
      board.getBoard(),
    );
  });
});