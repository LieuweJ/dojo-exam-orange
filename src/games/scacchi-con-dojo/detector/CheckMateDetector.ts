import { IKingInCheckDetector } from './KingInCheckDetector';
import { IBoardState } from '../../../core/model/boardState';
import { Team } from '../../../core/model/team';
import { ChessPiece } from '../model/chessPiece';
import { IMoveHandler } from '../../../core/handler/MoveHandler';

export type ICheckMateDetector = {
  isCheckMate(input: { board: IBoardState; team: Team }): boolean;
};

type CheckMateInput = {
  board: IBoardState;
  team: Team;
};

export class CheckMateDetector implements ICheckMateDetector {
  constructor(
    private readonly kingInCheckDetector: IKingInCheckDetector,
    private readonly moveHandler: IMoveHandler<ChessPiece>
  ) {}

  isCheckMate({ board, team }: CheckMateInput): boolean {
    if (!this.kingInCheckDetector.isInCheck({ board, team })) {
      return false;
    }

    // For each piece of the team
    for (const piece of this.getTeamPieces(board, team)) {
      const from = board.getPiecePositionBy(piece);
      if (!from) {
        continue;
      }

      for (const target of piece.getAllReachablePositions(board)) {
        const clonedBoard = board.clone();

        const clonedPiece = clonedBoard.getBoardCellAt(from);
        if (!(clonedPiece instanceof ChessPiece)) {
          continue;
        }

        this.moveHandler.handle({ piece: clonedPiece, position: target }, clonedBoard);

        if (!this.kingInCheckDetector.isInCheck({ board: clonedBoard, team })) {
          return false; // escape found
        }
      }
    }

    return true; // no escape
  }

  private getTeamPieces(board: IBoardState, team: Team): ChessPiece[] {
    const pieces: ChessPiece[] = [];

    for (const row of board.getBoard()) {
      for (const cell of row) {
        if (cell instanceof ChessPiece && cell.isTeam(team)) {
          pieces.push(cell);
        }
      }
    }

    return pieces;
  }
}
