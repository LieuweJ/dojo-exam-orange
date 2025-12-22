import { ProposedMove, RuleStrategy, RuleViolation } from '../../../model/rules';

export type IRulesChainHandler = {
  check: (proposedMove: ProposedMove) => RuleViolation[] | null;
};

export class RulesChainHandler implements IRulesChainHandler {
  constructor(private readonly strategies: RuleStrategy[]) {}

  public check({ move, constraints }: ProposedMove): RuleViolation[] | null {
    const violations: RuleViolation[] = [];

    for (const strategy of this.strategies) {
      const result = strategy.check({ move, constraints });

      if (result) {
        violations.push(...result);
      }
    }

    return violations.length > 0 ? violations : null;
  }
}
