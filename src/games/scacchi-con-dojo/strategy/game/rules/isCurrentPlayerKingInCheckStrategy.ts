import { RuleStrategy, RuleViolation } from '../../../../../core/model/rules';
import { CHESS_RULE_VIOLATION_TYPES, ChessRuleViolationType } from './violationTypes';
import { ProposedChessMove } from '../../../model/move';
import { IKingInCheckDetector } from '../../../detector/KingInCheckDetector';
import { IChessPiece } from '../../../model/chessPiece';
import { ChessMoveHandler } from '../../../handler/ChessMoveHandler';
import { ISimulationFactory } from '../../../factory/chessSimulationFactory';

export class IsCurrentPlayerKingInCheckStrategy implements RuleStrategy<ChessRuleViolationType> {
  constructor(
    private readonly kingInCheckDetector: IKingInCheckDetector,
    private readonly moveHandler: ChessMoveHandler,
    private readonly simulationFactory: ISimulationFactory<IChessPiece>
  ) {}

  check({ move, moveContext }: ProposedChessMove): RuleViolation<ChessRuleViolationType>[] | null {
    const {
      board: clonedBoard,
      move: { piece: clonedPiece },
    } = this.simulationFactory.createForMove(
      moveContext.board,
      moveContext.turn.getPlayers(),
      move
    );

    this.moveHandler.handle(
      {
        piece: clonedPiece,
        position: move.position,
        promotionKind: move.promotionKind,
      },
      clonedBoard
    );

    if (this.kingInCheckDetector.isInCheck({ board: clonedBoard, team: clonedPiece.getTeam() })) {
      return [{ reason: CHESS_RULE_VIOLATION_TYPES.INVALID_OWN_KING_IN_CHECK }];
    }

    return null;
  }
}
