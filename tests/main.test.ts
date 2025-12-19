import { Game, PlayersByMarker } from '../src/game';
import { Board, IBoardClass, IBoard, MARKER_O, MARKER_X, ColumnIndex } from '../src/model/board';
import { IOutputPresenter } from '../src/presenter/output/boardPresenter';
import { IColumnInputHandler } from '../src/handlers/columnInputHandler';
import { Player } from '../src/model/player';

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
      {
        [MARKER_X]: new Player('Alice'),
        [MARKER_O]: new Player('Bob'),
      },
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
    columnInputHandlerSpy.askFor.mockResolvedValue(col(4));

    game.play();

    expect(helpPresenterSpy.present).toHaveBeenCalledTimes(1);
    expect(boardPresenterSpy.present).toHaveBeenCalledWith(
      board.getBoard(),
    );
  });

  test('Board displays coins with correct colors for each player', () => {
    columnInputHandlerSpy.askFor.mockResolvedValue(col(4));
    game.play();

    expect(helpPresenterSpy.present).toHaveBeenCalledTimes(1);
    expect(boardPresenterSpy.present).toHaveBeenCalledWith(
      board.getBoard(),
    );
  });

  test('throws when player for MARKER_X is missing', () => {
    expect(() => {
      new Game(
        {
          [MARKER_O]: new Player('Bob'),
        } as PlayersByMarker,
        board,
        boardPresenterSpy,
        helpPresenterSpy,
        columnInputHandlerSpy
      );
    }).toThrow(
      new Error(`Player for marker ${MARKER_X.toString()} is missing.`)
    );
  });

  test('throws when player for MARKER_O is missing', () => {
    expect(() => {
      new Game(
        {
          [MARKER_X]: new Player('Alice'),
        } as PlayersByMarker,
        board,
        boardPresenterSpy,
        helpPresenterSpy,
        columnInputHandlerSpy
      );
    }).toThrow(
      new Error(`Player for marker ${MARKER_O.toString()} is missing.`)
    );
  });

});

export const col = (n: number) => n as ColumnIndex;