import { Team } from '../../../../src/core/model/team';
import { ChessPieceFactory } from '../../../../src/games/scacchi-con-dojo/factory/chessPieceFactory';
import { KingInCheckDetector } from '../../../../src/games/scacchi-con-dojo/detector/KingInCheckDetector';
import { CHESS_PIECE_KIND } from '../../../../src/games/scacchi-con-dojo/config/chessPiecesConfig';
import { BoardState, EMPTY_CELL } from '../../../../src/core/model/boardState';

describe('KingInCheckDetector', () => {
  const white = Symbol('white') as Team;
  const black = Symbol('black') as Team;

  let factory: ChessPieceFactory;
  let detector: KingInCheckDetector;

  beforeEach(() => {
    factory = new ChessPieceFactory();
    detector = new KingInCheckDetector();
  });

  it('throws when the king for the given team is not found on the board', () => {
    const blackRook = factory.create({
      team: black,
      kind: CHESS_PIECE_KIND.ROOK,
      index: 1,
    });

    const board = new BoardState([[EMPTY_CELL, blackRook]]);

    expect(() => detector.isInCheck({ board, team: white })).toThrow(
      `King for team ${String(white)} not found on the board.`
    );
  });

  it('returns false when the king is present and not under attack', () => {
    const whiteKing = factory.create({
      team: white,
      kind: CHESS_PIECE_KIND.KING,
      index: 1,
    });

    const blackRook = factory.create({
      team: black,
      kind: CHESS_PIECE_KIND.ROOK,
      index: 1,
    });

    const board = new BoardState([
      [whiteKing, EMPTY_CELL],
      [EMPTY_CELL, blackRook], // rook not attacking king
    ]);

    const result = detector.isInCheck({ board, team: white });

    expect(result).toBe(false);
  });

  it('returns true when the king is attacked by an opposing piece', () => {
    const whiteKing = factory.create({
      team: white,
      kind: CHESS_PIECE_KIND.KING,
      index: 1,
    });

    const blackRook = factory.create({
      team: black,
      kind: CHESS_PIECE_KIND.ROOK,
      index: 1,
    });

    const board = new BoardState([[blackRook], [EMPTY_CELL], [whiteKing]]);

    const result = detector.isInCheck({ board, team: white });

    expect(result).toBe(true);
  });
});
