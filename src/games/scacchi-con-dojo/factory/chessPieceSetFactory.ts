import { ChessPiece } from '../model/chessPiece';
import { IPiece } from '../../../core/model/IPiece';
import {
  CHESS_PIECE_DEFINITIONS,
  CHESS_PIECE_KIND,
  ChessPieceKind,
} from '../config/chessPiecesFactory';
import { ChessPiecePawn } from '../model/chessPiecePawn';

export type CreateChessPieceInput = {
  team: string;
  kind: Exclude<ChessPieceKind, typeof CHESS_PIECE_KIND.PAWN>;
  index: number;
  attackablePieces?: Set<IPiece>;
};

export type CreatePawnInput = {
  team: string;
  index: number;
  forwardDirection: { row: number; column: number };
  attackablePieces?: Set<IPiece>;
};

export class ChessPieceFactory {
  create({
    team,
    kind,
    index,
    attackablePieces = new Set<IPiece>(),
  }: CreateChessPieceInput): ChessPiece {
    this.assertNonePawnKind(kind);

    const definition = CHESS_PIECE_DEFINITIONS[kind];

    const boardValue = this.createBoardValue(team, kind, index);

    return new ChessPiece(
      boardValue,
      kind,
      definition.movement,
      attackablePieces,
      definition.castling.canInitiate,
      definition.castling.canParticipate
    );
  }

  createPawn({
    team,
    index,
    forwardDirection,
    attackablePieces = new Set<IPiece>(),
  }: CreatePawnInput): ChessPiecePawn {
    const boardValue = this.createBoardValue(team, CHESS_PIECE_KIND.PAWN, index);

    return new ChessPiecePawn(boardValue, forwardDirection, attackablePieces);
  }

  createFrom(source: ChessPiece, kind: ChessPieceKind, index: number): ChessPiece {
    const teamChar = source.getBoardValue().description?.slice(-1);
    if (!teamChar) {
      throw new Error('Cannot infer team from source piece.');
    }

    const team = String(teamChar);

    const attackablePieces = source.getAttackablePieces();

    if (kind === CHESS_PIECE_KIND.PAWN) {
      if (!(source instanceof ChessPiecePawn)) {
        throw new Error('Cannot promote non-pawn into pawn.');
      }

      return this.createPawn({
        team,
        index,
        forwardDirection: source.getForwardDirection(),
        attackablePieces,
      });
    }

    return this.create({
      team,
      kind,
      index,
      attackablePieces,
    });
  }

  private createBoardValue(team: string, kind: ChessPieceKind, index: number): symbol {
    const teamChar = team[0]?.toLowerCase() || '';
    const pieceChar = kind[0].toUpperCase();

    return Symbol(`${pieceChar}${index}${teamChar}`);
  }

  private assertNonePawnKind(kind: ChessPieceKind): void {
    if (kind === CHESS_PIECE_KIND.PAWN) {
      throw new Error('Pawn kind is not allowed in this method.');
    }
  }
}
