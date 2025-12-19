import { sum } from '../src/main';

describe('Sum should be', () => {
  test('total of 3 when adding 1 and 2', () => {
    const expectedOutput = 3;

    let result = sum(1, 2);

    expect(result).toBe(expectedOutput);
  });
});
