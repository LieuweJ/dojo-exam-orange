import { IPiece } from '../../../core/model/IPiece';
import { IPlayer } from '../../../core/model/player';
import { IBoard } from '../../../core/model/boardState';
import { Team } from '../../../core/model/team';
import { ChessPiece } from '../model/chessPiece';

export class CapturedPiecesProvider {
  getCapturedPieces(players: readonly IPlayer[], board: IBoard): Map<Team, ChessPiece[]> {
    const piecesOnBoard = new Set<IPiece>();

    for (const row of board) {
      for (const cell of row) {
        if (cell instanceof ChessPiece) {
          piecesOnBoard.add(cell);
        }
      }
    }

    const result = new Map<Team, ChessPiece[]>();

    for (const player of players) {
      const playerPieces = player.getPieces();

      const firstPlayerPiece = playerPieces[0];
      if (!(firstPlayerPiece instanceof ChessPiece)) {
        throw new Error(
          'Expected player pieces to be of type ChessPiece. Team cannot be determined.'
        );
      }

      const captured = playerPieces.filter(
        (piece): piece is ChessPiece => piece instanceof ChessPiece && !piecesOnBoard.has(piece)
      );

      result.set(firstPlayerPiece.getTeam(), captured);
    }

    return result;
  }
}
