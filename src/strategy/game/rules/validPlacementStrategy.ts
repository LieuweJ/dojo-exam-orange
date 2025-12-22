import { IBoardConstraints, Move } from '../../../model/boardState';
import { RuleStrategy, RuleViolation } from '../../../model/rules';

export type MoveConstraints = IBoardConstraints;

export type ProposedMove = { move: Move; constraints: MoveConstraints };

export class ValidPlacementStrategy implements RuleStrategy<ProposedMove> {
  check({ move, constraints }: ProposedMove): RuleViolation[] | null {
    if (!constraints.canAddMove(move)) {
      return ['INVALID_MOVE'];
    }

    return null;
  }
}
