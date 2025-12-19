import { Game } from '../src/game';
import { Board, IBoardClass } from '../src/model/board';
import { IBoardPresenter } from '../src/presenter/boardPresenter';

describe('A game of orange-in-a-row can be played', () => {
  let board: IBoardClass;
  let presenterSpy: jest.Mocked<IBoardPresenter>;
  let game: Game;

  beforeEach(() => {
    board = new Board();

    presenterSpy = {
      present: jest.fn(),
    };

    game = new Game({
      board,
      boardPresenter: presenterSpy,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('new game presents the initial board', () => {
    game.play();

    expect(presenterSpy.present).toHaveBeenCalledWith(board.getBoard());
  });
});