import { IMoveStrategy } from '../../../../core/strategy/player/move-strategy';
import { ChessMove } from '../../handler/ChessMoveHandler';

export class CliChessMoveStrategy implements IMoveStrategy {
  async createNextMove(): Promise<ChessMove> {
    throw new Error('Not implemented yet');
  }

  //
  // constructor(
  //   private readonly input: IInputAdapter,
  //   private readonly output: IOutputAdapter,
  //   private readonly boardPresenter: IOutputPresenter<BoardPresentArgs>
  // ) {}
  //
  // async createNextMove(board: IBoard, pieces: Pieces, currentPlayer: IPlayer): Promise<ChessMove> {
  //   const boardState = new BoardState(board);
  //
  //   while (true) {
  //     const piece = await this.askPiece(pieces, board, currentPlayer.getScreenName());
  //     const reachable = piece.getAllReachablePositions(boardState);
  //
  //     if (reachable.length === 0) {
  //       this.output.render('That piece has no legal moves.');
  //       continue;
  //     }
  //
  //     this.presentReachable(board, reachable);
  //     const destination = await this.askDestination(reachable);
  //     const promotionKind = await this.askPromotionIfNeeded(piece, destination, boardState);
  //
  //     return {
  //       piece,
  //       position: destination,
  //       promotionKind,
  //     };
  //   }
  // }
  //
  // private async askPiece(pieces: Pieces, board: IBoard, displayName: string): Promise<ChessPiece> {
  //   while (true) {
  //     const input = await this.input.ask(`${displayName}, select a piece to move (e.g. e2): `);
  //
  //     let position: BoardPosition;
  //
  //     try {
  //       position = this.parseBoardPosition(input);
  //     } catch {
  //       this.output.render('Invalid position format.');
  //       continue;
  //     }
  //
  //     const cell = board[position.row][position.column];
  //
  //     if (!(cell instanceof ChessPiece)) {
  //       this.output.render('No piece at that position.');
  //       continue;
  //     }
  //
  //     if (!pieces.includes(cell)) {
  //       this.output.render('That is not your piece.');
  //       continue;
  //     }
  //
  //     return cell;
  //   }
  // }
  //
  // private presentReachable(board: IBoard, positions: BoardPosition[]): void {
  //   this.boardPresenter.present({
  //     board,
  //     highlightPositions: positions,
  //     players: [],
  //   });
  // }
  //
  // private async askDestination(reachable: BoardPosition[]): Promise<BoardPosition> {
  //   const reachableSet = new Set(reachable.map((p) => `${p.row},${p.column}`));
  //
  //   while (true) {
  //     const input = await this.input.ask('Choose destination (e.g. e4): ');
  //
  //     let position: BoardPosition;
  //
  //     try {
  //       position = this.parseBoardPosition(input);
  //     } catch {
  //       this.output.render('Invalid position format.');
  //       continue;
  //     }
  //
  //     if (!reachableSet.has(`${position.row},${position.column}`)) {
  //       this.output.render('That square is not reachable.');
  //       continue;
  //     }
  //
  //     return position;
  //   }
  // }
  //
  // private async askPromotionIfNeeded(
  //   piece: ChessPiece,
  //   destination: BoardPosition,
  //   board: BoardState
  // ): Promise<ChessPieceKind | undefined> {
  //   if (!(piece instanceof ChessPiecePawn)) {
  //     return undefined;
  //   }
  //
  //   if (!piece.canPromote(destination, board)) {
  //     return undefined;
  //   }
  //
  //   while (true) {
  //     const input = await this.input.ask('Promote to (Q, R, B, N): ');
  //
  //     const promotion = this.mapPromotion(input);
  //     if (!promotion) {
  //       this.output.render('Invalid promotion choice.');
  //       continue;
  //     }
  //
  //     return promotion;
  //   }
  // }
  //
  // private mapPromotion(input: string): ChessPieceKind | undefined {
  //   switch (input.toUpperCase()) {
  //     case 'Q':
  //       return CHESS_PIECE_KIND.QUEEN;
  //     case 'R':
  //       return CHESS_PIECE_KIND.ROOK;
  //     case 'B':
  //       return CHESS_PIECE_KIND.BISHOP;
  //     case 'N':
  //       return CHESS_PIECE_KIND.KNIGHT;
  //     default:
  //       return undefined;
  //   }
  // }
  //
  // private parseBoardPosition(input: string): BoardPosition {
  //   if (!/^[a-h][1-8]$/.test(input)) {
  //     throw new Error('Invalid board position');
  //   }
  //
  //   const column = input.charCodeAt(0) - 'a'.charCodeAt(0);
  //   const row = 8 - Number(input[1]);
  //
  //   return { row, column };
  // }
}
