import { IPiece } from '../../../core/model/IPiece';

export class CoinPiece implements IPiece {
  constructor(private readonly id: symbol) {}

  getBoardValue(): symbol {
    return this.id;
  }
}
