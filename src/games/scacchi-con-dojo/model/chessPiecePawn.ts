import { ChessPiece, Direction, RelativeMovement } from './chessPiece';
import { BoardCell, BoardPosition, EmptyCell, IBoardState } from '../../../core/model/boardState';
import { CHESS_PIECE_KIND } from '../config/chessPiecesConfig';
import { Team } from '../../../core/model/team';

export class ChessPiecePawn extends ChessPiece {
  private forwardMovement: RelativeMovement;
  private readonly attackDirections: Direction[];
  private readonly enPassantColumns = new Set<number>();

  constructor(
    boardValue: symbol,
    forwardDirection: {
      row: number;
      column: number;
    },
    team: Team
  ) {
    const forwardMovement: RelativeMovement = {
      direction: [forwardDirection],
      maxSteps: 2,
    };

    super(boardValue, CHESS_PIECE_KIND.PAWN, new Set([forwardMovement]), team);

    this.forwardMovement = forwardMovement;
    this.attackDirections = [
      { row: forwardDirection.row, column: -1 },
      { row: forwardDirection.row, column: 1 },
    ];
  }

  canReachPosition(position: BoardPosition, boardState: IBoardState): boolean {
    // Forward movement (reuse base ray logic)
    if (super.canReachPosition(position, boardState)) {
      return true;
    }

    // Diagonal attack
    if (this.canAttack(position, boardState)) {
      return true;
    }

    // En Passant attack
    return this.canEnPassantAttack(position, boardState);
  }

  markMoved(): void {
    super.markMoved();

    this.forwardMovement.maxSteps = 1;
  }

  canPromote(position: BoardPosition, boardState: IBoardState): boolean {
    const from = boardState.getPiecePositionBy(this);
    if (!from) {
      return false;
    }

    const board = boardState.getBoard();
    const lastRow = this.attackDirections[0].row === -1 ? 0 : board.length - 1;

    return position.row === lastRow;
  }

  getForwardDirection(): Direction {
    return this.forwardMovement.direction[0];
  }

  addEnPassantTargetColumn(column: number): void {
    this.enPassantColumns.add(column);
  }

  clearEnPassantTargets(): void {
    this.enPassantColumns.clear();
  }

  canEnPassantAttack(position: BoardPosition, boardState: IBoardState): boolean {
    const from = boardState.getPiecePositionBy(this);
    if (!from) return false;

    // determine forward direction from pawn movement
    const forwardRow = this.attackDirections[0].row;

    for (const targetColumn of this.enPassantColumns) {
      const targetPos: BoardPosition = {
        row: from.row,
        column: targetColumn,
      };

      const targetCell = boardState.getBoardCellAt(targetPos);
      if (!(targetCell instanceof ChessPiecePawn)) {
        continue;
      }

      const landingSquare: BoardPosition = {
        row: from.row + forwardRow,
        column: targetPos.column,
      };

      if (
        landingSquare.row === position.row &&
        landingSquare.column === position.column &&
        boardState.getBoardCellAt(landingSquare) instanceof EmptyCell
      ) {
        return true;
      }
    }

    return false;
  }

  protected isReachableTarget(cell: BoardCell): boolean {
    return cell instanceof EmptyCell;
  }

  private canAttack(position: BoardPosition, boardState: IBoardState): boolean {
    const from = boardState.getPiecePositionBy(this);
    if (!from) {
      return false;
    }

    for (const dir of this.attackDirections) {
      const target: BoardPosition = {
        row: from.row + dir.row,
        column: from.column + dir.column,
      };

      if (target.row === position.row && target.column === position.column) {
        const cell = boardState.getBoardCellAt(target);

        if (!(cell instanceof ChessPiece)) {
          return false;
        }

        return !cell.isTeam(this.team);
      }
    }

    return false;
  }
}
