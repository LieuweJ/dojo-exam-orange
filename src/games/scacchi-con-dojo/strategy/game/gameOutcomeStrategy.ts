import { Player } from '../../../../core/model/player';
import {
  GAME_OUTCOME,
  GameOutcome,
  IGameOutcomeStrategy,
} from '../../../../core/strategy/game/gameOutcomeStrategy';
import { ICheckMateDetector } from '../../detector/CheckMateDetector';
import { BoardPosition, BoardState, IBoard } from '../../../../core/model/boardState';
import { Team } from '../../../../core/model/team';
import { IKingInCheckDetector } from '../../detector/KingInCheckDetector';
import { ChessPiece } from '../../model/chessPiece';

export class ChessGameOutcomeStrategy implements IGameOutcomeStrategy {
  constructor(
    private readonly checkMateDetector: ICheckMateDetector,
    private readonly kingInCheckDetector: IKingInCheckDetector
  ) {}

  determine(board: IBoard, players: Player[]): GameOutcome {
    const boardState = new BoardState(board);
    for (const player of players) {
      const team = this.getTeamForPlayer(player);

      if (this.checkMateDetector.isCheckMate({ board: boardState, team, players })) {
        const winner = this.findOpponent(player, players);
        const kingPosition = this.kingInCheckDetector.getKingPosition(boardState, team);
        const attackers = this.kingInCheckDetector.getCheckingPieces(boardState, team);

        const attackerPositions: BoardPosition[] = attackers.map((piece) => {
          const attackerPosition = boardState.getPiecePositionBy(piece);
          if (!attackerPosition) {
            throw new Error('Attacking piece not found on board');
          }

          return attackerPosition;
        });

        return {
          type: GAME_OUTCOME.WIN,
          winner,
          winningPositions: [kingPosition, ...attackerPositions],
        };
      }
    }

    return { type: GAME_OUTCOME.ONGOING };
  }

  private findOpponent(player: Player, players: Player[]): Player {
    const opponent = players.find((p) => p !== player);

    if (!opponent) {
      throw new Error('Opponent not found.');
    }

    return opponent;
  }

  private getTeamForPlayer(player: Player): Team {
    const piece = player.getPieces()[0];

    if (!(piece instanceof ChessPiece)) {
      throw new Error(
        `Player does not have a chessPiece assigned to them. piece ${String(piece.getBoardValue())} if of type ${typeof piece}`
      );
    }

    return piece.getTeam();
  }
}
