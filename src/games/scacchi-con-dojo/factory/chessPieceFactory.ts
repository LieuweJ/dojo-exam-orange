import { ChessPiece, IChessPiece } from '../model/chessPiece';
import {
  CHESS_PIECE_DEFINITIONS,
  CHESS_PIECE_KIND,
  ChessPieceKind,
} from '../config/chessPiecesConfig';
import { ChessPiecePawn } from '../model/chessPiecePawn';
import { Team } from '../../../core/model/team';

export const PAWN_DIRECTION = {
  TOWARDS_TOP: 'towards_top',
  TOWARDS_BOTTOM: 'towards_bottom',
} as const;

export type PawnDirection = (typeof PAWN_DIRECTION)[keyof typeof PAWN_DIRECTION];

export const PAWN_FORWARD_VECTOR: Record<PawnDirection, { row: number; column: number }> = {
  [PAWN_DIRECTION.TOWARDS_TOP]: { row: -1, column: 0 },
  [PAWN_DIRECTION.TOWARDS_BOTTOM]: { row: 1, column: 0 },
};

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

export type ChessPieceSetByKind = Map<ChessPieceKind, ChessPiece[]>;

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

  createFrom(source: IChessPiece, kind: ChessPieceKind, index: number): ChessPiece {
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

  createInitialPieceSet(team: Team, pawnDirection: PawnDirection): ChessPieceSetByKind {
    const byKind = new Map<ChessPieceKind, ChessPiece[]>();

    const add = (piece: ChessPiece) => {
      const list = byKind.get(piece.getKind()) ?? [];
      list.push(piece);
      byKind.set(piece.getKind(), list);
    };

    add(this.create({ team, kind: CHESS_PIECE_KIND.KING, index: 1 }));
    add(this.create({ team, kind: CHESS_PIECE_KIND.QUEEN, index: 1 }));
    add(this.create({ team, kind: CHESS_PIECE_KIND.ROOK, index: 1 }));
    add(this.create({ team, kind: CHESS_PIECE_KIND.ROOK, index: 2 }));
    add(this.create({ team, kind: CHESS_PIECE_KIND.BISHOP, index: 1 }));
    add(this.create({ team, kind: CHESS_PIECE_KIND.BISHOP, index: 2 }));
    add(this.create({ team, kind: CHESS_PIECE_KIND.KNIGHT, index: 1 }));
    add(this.create({ team, kind: CHESS_PIECE_KIND.KNIGHT, index: 2 }));

    const forwardDirection = PAWN_FORWARD_VECTOR[pawnDirection];

    for (let i = 1; i <= 8; i++) {
      add(
        this.createPawn({
          team,
          index: i,
          forwardDirection,
        })
      );
    }

    return byKind;
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
