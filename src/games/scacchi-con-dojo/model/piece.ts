import { IPiece } from '../../../core/model/IPiece';

export class ChessPiece implements IPiece {
  constructor(public readonly boardValue: symbol) {}

  getBoardValue(): symbol {
    return this.boardValue;
  }
}
