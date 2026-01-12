import { CoinPiece } from '../../../src/sharedMechanics/connectLineGame/model/coinPiece';
import { IMoveStrategy } from '../../../src/core/strategy/player/move-strategy';
import { Pieces, Player } from '../../../src/core/model/player';

describe('Player.cloneWithPieces', () => {
  let strategy: IMoveStrategy;
  let originalPieces: Pieces;
  let clonedPieces: Pieces;
  let player: Player;

  beforeEach(() => {
    // Simple mock strategy – behavior not under test here
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
    expect(clonedPlayer.getPieces()).toBe(clonedPieces);

    // Does not reuse original pieces
    expect(clonedPlayer.hasPiece(originalPieces[0])).toBe(false);
    expect(clonedPlayer.hasPiece(clonedPieces[0])).toBe(true);
  });
});
