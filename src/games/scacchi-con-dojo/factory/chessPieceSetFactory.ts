import { ChessPiece } from '../model/chessPiece';
import { IPiece } from '../../../core/model/IPiece';
import { CHESS_PIECE_DEFINITIONS, ChessPieceKind } from '../config/chessPiecesFactory';

export type CreateChessPieceInput = {
  team: string;
  kind: ChessPieceKind;
  index: number;
  attackablePieces?: Set<IPiece>;
};

export class ChessPieceFactory {
  create({
    team,
    kind,
    index,
    attackablePieces = new Set<IPiece>(),
  }: CreateChessPieceInput): ChessPiece {
    const definition = CHESS_PIECE_DEFINITIONS[kind];

    const boardValue = this.createBoardValue(team, kind, index);

    return new ChessPiece(
      boardValue,
      definition.movement,
      attackablePieces,
      definition.castling.canInitiate,
      definition.castling.canParticipate
    );
  }

  private createBoardValue(team: string, kind: ChessPieceKind, index: number): symbol {
    const teamChar = team[0]?.toLowerCase() || '';
    const pieceChar = kind[0].toUpperCase();

    return Symbol(`${pieceChar}${index}${teamChar}`);
  }
}
