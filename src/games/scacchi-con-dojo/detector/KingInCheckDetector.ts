import { BoardPosition, IBoardState } from '../../../core/model/boardState';
import { Team } from '../../../core/model/team';
import { ChessPiece } from '../model/chessPiece';
import { CHESS_PIECE_KIND } from '../config/chessPiecesConfig';

type KingInCheckDetectorInput = { board: IBoardState; team: Team };

export class KingInCheckDetector {
  isInCheck({ board, team }: KingInCheckDetectorInput): boolean {
    const kingPosition = this.findKingPosition(board, team);

    if (!kingPosition) {
      throw new Error(`King for team ${String(team)} not found on the board.`);
    }

    return this.isSquareAttacked(board, kingPosition, team);
  }

  private findKingPosition(board: IBoardState, team: Team): BoardPosition | null {
    const grid = board.getBoard();

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const cell = grid[row][col];

        if (
          cell instanceof ChessPiece &&
          cell.getKind() === CHESS_PIECE_KIND.KING &&
          cell.isTeam(team)
        ) {
          return { row, column: col };
        }
      }
    }

    return null;
  }

  private isSquareAttacked(
    board: IBoardState,
    target: BoardPosition,
    defendingTeam: Team
  ): boolean {
    const grid = board.getBoard();

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const cell = grid[row][col];

        if (cell instanceof ChessPiece && !cell.isTeam(defendingTeam)) {
          if (cell.canReachPosition(target, board)) {
            return true;
          }
        }
      }
    }

    return false;
  }
}
