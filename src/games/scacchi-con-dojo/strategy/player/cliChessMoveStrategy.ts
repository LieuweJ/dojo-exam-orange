import { CreateNextMoveInput, IMoveStrategy } from '../../../../core/strategy/player/move-strategy';
import { ChessMove } from '../../handler/ChessMoveHandler';
import { IInputAdapter } from '../../../../core/adapters/terminalInputAdapter';
import { IOutputAdapter } from '../../../../core/adapters/terminalOutputAdapter';
import { BoardPresentArgs, IOutputPresenter } from '../../../../core/presenter/boardPresenter';
import { BoardPosition, BoardState, IBoard } from '../../../../core/model/boardState';
import { IPlayer, Pieces } from '../../../../core/model/player';
import { ChessPiece } from '../../model/chessPiece';
import { CHESS_PIECE_KIND, ChessPieceKind } from '../../config/chessPiecesConfig';
import { ChessPiecePawn } from '../../model/chessPiecePawn';
import { ChessPieceUi } from '../../composition/chessComposition';

const RETRY = '!';

export class CliChessMoveStrategy implements IMoveStrategy {
  constructor(
    private readonly input: IInputAdapter,
    private readonly output: IOutputAdapter,
    private readonly boardPresenter: IOutputPresenter<BoardPresentArgs>,
    private readonly chessPieceToUi: Map<ChessPieceKind, ChessPieceUi>
  ) {}

  async createNextMove({
    context: { board, players },
    currentPlayer,
  }: CreateNextMoveInput): Promise<ChessMove> {
    const boardState = new BoardState(board);

    while (true) {
      const piece = await this.askPiece(
        currentPlayer.getPieces(),
        board,
        currentPlayer.getScreenName()
      );
      const reachable = piece.getAllReachablePositions(boardState);

      if (reachable.length === 0) {
        this.output.render('That piece has no legal moves.');
        continue;
      }

      this.presentReachable(board, reachable, players);
      const destination = await this.askDestination(reachable);
      if (destination === RETRY) {
        this.boardPresenter.present({ board, players });
        continue;
      }

      const promotionKind = await this.askPromotionIfNeeded(piece, destination, boardState);
      if (promotionKind === RETRY) {
        this.boardPresenter.present({ board, players });
        continue;
      }

      return {
        piece,
        position: destination,
        promotionKind,
      };
    }
  }

  private async askPiece(
    currentPlayerPieces: Pieces,
    board: IBoard,
    displayName: string
  ): Promise<ChessPiece> {
    while (true) {
      const input = await this.input.ask(
        `${displayName} (${this.getPlayerUi(currentPlayerPieces)}), select a piece under to move (e.g. e2): `
      );

      let position: BoardPosition;

      try {
        position = this.parseBoardPosition(input);
      } catch {
        this.output.render('Invalid position format.');
        continue;
      }

      const cell = board[position.row][position.column];

      if (!(cell instanceof ChessPiece)) {
        this.output.render('No piece at that position.');
        continue;
      }

      if (!currentPlayerPieces.includes(cell)) {
        this.output.render('That is not your piece.');
        continue;
      }

      return cell;
    }
  }

  private presentReachable(board: IBoard, positions: BoardPosition[], players: IPlayer[]): void {
    this.boardPresenter.present({
      board,
      highlightPositions: positions,
      players,
    });
  }

  private async askDestination(reachable: BoardPosition[]): Promise<BoardPosition | typeof RETRY> {
    const reachableSet = new Set(reachable.map((p) => `${p.row},${p.column}`));

    while (true) {
      const input = await this.input.ask(
        `Choose destination (e.g. e4) or ${RETRY} to reselect piece: `
      );

      if (input === RETRY) {
        return RETRY;
      }

      let position: BoardPosition;

      try {
        position = this.parseBoardPosition(input);
      } catch {
        this.output.render('Invalid position format.');
        continue;
      }

      if (!reachableSet.has(`${position.row},${position.column}`)) {
        this.output.render('That square is not reachable.');
        continue;
      }

      return position;
    }
  }

  private async askPromotionIfNeeded(
    piece: ChessPiece,
    destination: BoardPosition,
    board: BoardState
  ): Promise<ChessPieceKind | typeof RETRY | undefined> {
    if (!(piece instanceof ChessPiecePawn)) {
      return undefined;
    }

    if (!piece.canPromote(destination, board)) {
      return undefined;
    }

    while (true) {
      const input = await this.input.ask(`Promote to (Q, R, B, N) or ${RETRY} to reselect piece: `);

      if (input === RETRY) {
        return RETRY;
      }

      const promotion = this.mapPromotion(input);
      if (!promotion) {
        this.output.render('Invalid promotion choice.');
        continue;
      }

      return promotion;
    }
  }

  private mapPromotion(input: string): ChessPieceKind | undefined {
    switch (input.toUpperCase()) {
      case 'Q':
        return CHESS_PIECE_KIND.QUEEN;
      case 'R':
        return CHESS_PIECE_KIND.ROOK;
      case 'B':
        return CHESS_PIECE_KIND.BISHOP;
      case 'N':
        return CHESS_PIECE_KIND.KNIGHT;
      default:
        return undefined;
    }
  }

  private parseBoardPosition(input: string): BoardPosition {
    if (!/^[a-h][1-8]$/.test(input)) {
      throw new Error('Invalid board position');
    }

    const column = input.charCodeAt(0) - 'a'.charCodeAt(0);
    const row = 8 - Number(input[1]);

    return { row, column };
  }

  private getPlayerUi(currentPlayerPieces: Pieces): string {
    let playerUi = 'unknown side';

    const playerPiece = currentPlayerPieces[0];

    if (!(playerPiece instanceof ChessPiece)) {
      return playerUi;
    }

    return this.chessPieceToUi.get(CHESS_PIECE_KIND.KING)?.get(playerPiece.getTeam()) ?? playerUi;
  }
}
