import { BoardPosition, IBoardState } from '../../../core/model/boardState';
import { Team } from '../../../core/model/team';
import { ChessPiece } from '../model/chessPiece';
import { CHESS_PIECE_KIND } from '../config/chessPiecesConfig';

export type IKingInCheckDetector = {
  isInCheck(input: { board: IBoardState; team: Team }): boolean;
  getKingPosition(board: IBoardState, team: Team): BoardPosition;
  getCheckingPieces(board: IBoardState, team: Team): ChessPiece[];
};

type KingInCheckDetectorInput = { board: IBoardState; team: Team };

export class KingInCheckDetector implements IKingInCheckDetector {
  isInCheck({ board, team }: KingInCheckDetectorInput): boolean {
    const kingPosition = this.getKingPosition(board, team);

    return this.isSquareAttacked(board, kingPosition, team);
  }

  getCheckingPieces(board: IBoardState, teamInCheck: Team): ChessPiece[] {
    const kingPosition = this.getKingPosition(board, teamInCheck);

    const attackers: ChessPiece[] = [];

    for (const row of board.getBoard()) {
      for (const cell of row) {
        if (
          cell instanceof ChessPiece &&
          !cell.isTeam(teamInCheck) &&
          cell.canReachPosition(kingPosition, board)
        ) {
          attackers.push(cell);
        }
      }
    }

    return attackers;
  }

  getKingPosition(board: IBoardState, team: Team): BoardPosition {
    const position = this.findKingPosition(board, team);

    if (!position) {
      throw new Error(`King for team ${String(team)} not found on the board.`);
    }

    return position;
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
