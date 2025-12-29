import {
  BaseRuleViolationType,
  ProposedMove,
  RuleStrategy,
  RuleViolation,
} from '../../../model/rules';

export type IRulesChainHandler = {
  check: (proposedMove: ProposedMove) => RuleViolation<BaseRuleViolationType>[] | null;
};

export class RulesChainHandler implements IRulesChainHandler {
  constructor(private readonly strategies: RuleStrategy<BaseRuleViolationType>[]) {}

  public check(proposedMove: ProposedMove): RuleViolation<BaseRuleViolationType>[] | null {
    const violations: RuleViolation<BaseRuleViolationType>[] = [];

    for (const strategy of this.strategies) {
      const result = strategy.check(proposedMove);

      if (result) {
        violations.push(...result);
      }
    }

    return violations.length > 0 ? violations : null;
  }
}
