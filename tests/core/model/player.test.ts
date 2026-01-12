import { CoinPiece } from '../../../src/sharedMechanics/connectLineGame/model/coinPiece';
import { IMoveStrategy } from '../../../src/core/strategy/player/move-strategy';
import { Pieces, Player } from '../../../src/core/model/player';

describe('Player', () => {
  let strategy: IMoveStrategy;
  let originalPieces: Pieces;
  let clonedPieces: Pieces;
  let player: Player;

  beforeEach(() => {
    strategy = {
      createNextMove: jest.fn(),
    };

    const pieceA = new CoinPiece(Symbol('A'));
    const pieceB = new CoinPiece(Symbol('B'));

    originalPieces = [pieceA, pieceB];

    const clonedPieceA = pieceA.clone();
    const clonedPieceB = pieceB.clone();

    clonedPieces = [clonedPieceA, clonedPieceB];

    player = new Player('Alice', strategy, originalPieces);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a new player instance with the provided pieces', () => {
    const clonedPlayer = player.cloneWithPieces(clonedPieces);

    // New instance
    expect(clonedPlayer).not.toBe(player);

    // Same identity data
    expect(clonedPlayer.getScreenName()).toBe(player.getScreenName());

    // Uses provided pieces
    expect(clonedPlayer.getPieces()).not.toBe(clonedPieces);
    expect(clonedPlayer.getPieces()).toStrictEqual(clonedPieces);

    // Does not reuse original pieces
    expect(clonedPlayer.hasPiece(originalPieces[0])).toBe(false);
    expect(clonedPlayer.hasPiece(clonedPieces[0])).toBe(true);
  });

  it('throws when creating a player with no pieces', () => {
    expect(() => {
      new Player('Alice', strategy, [] as unknown as Pieces);
    }).toThrow('Player must have at least one piece.');
  });

  it('throws when removing the last remaining piece', () => {
    const singlePiece = new CoinPiece(Symbol('C'));
    const singlePiecePlayer = new Player('Bob', strategy, [singlePiece]);

    expect(() => {
      singlePiecePlayer.removePiece(singlePiece);
    }).toThrow('Player must keep at least one piece.');
  });
});
