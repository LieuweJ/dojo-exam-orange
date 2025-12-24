import { BoardPosition, EMPTY_CELL, IBoard } from '../../../../core/model/boardState';
import { Piece, Player } from '../../../../core/model/player';
import {
  GAME_OUTCOME,
  GameOutcome,
  GameOutComeWin,
  IGameOutcomeStrategy,
} from '../../../../core/strategy/game/gameOutcomeStrategy';

type WinConditions = {
  connectionLength: number;
};

type Direction = { deltaRow: number; deltaCol: number };

const DIRECTIONS: Direction[] = [
  { deltaRow: 0, deltaCol: 1 }, // →
  { deltaRow: 1, deltaCol: 0 }, // ↓
  { deltaRow: 1, deltaCol: 1 }, // ↘
  { deltaRow: 1, deltaCol: -1 }, // ↗
];

export class ConnectLineGameOutcomeStrategy implements IGameOutcomeStrategy {
  constructor(private readonly winConditions: WinConditions) {}

  determine(board: IBoard, players: Player[]): GameOutcome {
    const winningOutcome = this.findWinningOutcome(board, players);

    if (winningOutcome) {
      return winningOutcome;
    }

    if (this.isDraw(board)) {
      return { type: GAME_OUTCOME.DRAW };
    }

    return { type: GAME_OUTCOME.ONGOING };
  }

  private findWinningOutcome(board: IBoard, players: Player[]): GameOutComeWin | null {
    const rows = board.length;
    const cols = board[0]?.length ?? 0;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = board[row][col];

        if (cell === EMPTY_CELL) continue;

        for (const direction of DIRECTIONS) {
          const winningPositions = this.hasLine(board, { row, column: col }, direction, cell);

          if (winningPositions) {
            const winner = this.findWinner(cell, players);

            return {
              type: GAME_OUTCOME.WIN,
              winner,
              winningPositions,
            };
          }
        }
      }
    }

    return null;
  }

  private findWinner(cell: Piece, players: Player[]): Player {
    for (const player of players) {
      if (player.hasPiece(cell)) {
        return player;
      }
    }

    throw Error('No player can be matched to the winning combination.');
  }

  private hasLine(
    board: IBoard,
    start: BoardPosition,
    direction: Direction,
    piece: Piece
  ): BoardPosition[] | null {
    const positions: BoardPosition[] = [start];

    for (let i = 1; i < this.winConditions.connectionLength; i++) {
      const row = start.row + direction.deltaRow * i;
      const col = start.column + direction.deltaCol * i;

      if (
        row < 0 ||
        row >= board.length ||
        col < 0 ||
        col >= board[0].length ||
        board[row][col] !== piece
      ) {
        return null;
      }

      positions.push({ row, column: col });
    }

    return positions;
  }

  private isDraw(board: IBoard): boolean {
    for (const row of board) {
      for (const cell of row) {
        if (cell === EMPTY_CELL) {
          return false;
        }
      }
    }

    return true;
  }
}
