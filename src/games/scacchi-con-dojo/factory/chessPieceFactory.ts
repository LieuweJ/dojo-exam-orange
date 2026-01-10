import { ChessPiece } from '../model/chessPiece';
import {
  CHESS_PIECE_DEFINITIONS,
  CHESS_PIECE_KIND,
  ChessPieceKind,
} from '../config/chessPiecesConfig';
import { ChessPiecePawn } from '../model/chessPiecePawn';
import { Team } from '../../../core/model/team';

export type CreateChessPieceInput = {
  team: Team;
  kind: Exclude<ChessPieceKind, typeof CHESS_PIECE_KIND.PAWN>;
  index: number;
};

export type CreatePawnInput = {
  team: Team;
  index: number;
  forwardDirection: { row: number; column: number };
};

export class ChessPieceFactory {
  create({ team, kind, index }: CreateChessPieceInput): ChessPiece {
    this.assertNonePawnKind(kind);

    const definition = CHESS_PIECE_DEFINITIONS[kind];

    const boardValue = this.createBoardValue(team, kind, index);

    return new ChessPiece(
      boardValue,
      kind,
      definition.movement,
      team,
      definition.castling.canInitiate,
      definition.castling.canParticipate
    );
  }

  createPawn({ team, index, forwardDirection }: CreatePawnInput): ChessPiecePawn {
    const boardValue = this.createBoardValue(team, CHESS_PIECE_KIND.PAWN, index);

    return new ChessPiecePawn(boardValue, forwardDirection, team);
  }

  createFrom(source: ChessPiece, kind: ChessPieceKind, index: number): ChessPiece {
    const team = source.getTeam();

    if (kind === CHESS_PIECE_KIND.PAWN) {
      if (!(source instanceof ChessPiecePawn)) {
        throw new Error('Cannot promote non-pawn into pawn.');
      }

      return this.createPawn({
        team,
        index,
        forwardDirection: source.getForwardDirection(),
      });
    }

    return this.create({
      team,
      kind,
      index,
    });
  }

  private createBoardValue(team: Team, kind: ChessPieceKind, index: number): symbol {
    const teamChar = team.description?.[0]?.toLowerCase() || '';
    const pieceChar = kind[0].toUpperCase();

    return Symbol(`${pieceChar}${index}${teamChar}`);
  }

  private assertNonePawnKind(kind: ChessPieceKind): void {
    if (kind === CHESS_PIECE_KIND.PAWN) {
      throw new Error('Pawn kind is not allowed in this method.');
    }
  }
}
