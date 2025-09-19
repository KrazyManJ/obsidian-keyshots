import { computeUnindent } from '../../src/commands/indent';

describe('unindent logic', () => {
  const cases: Array<[string, string, number]> = [
    // spaces
    [' -  1 space before -', '-  1 space before -', -1],
    ['  -  2 space before -', '-  2 space before -', -2],
    ['   - 3 space before -', '- 3 space before -', -3],
    ['    - 4 space before -', '- 4 space before -', -4],
    ['     - 5 space before -', ' - 5 space before -', -4],
    ['- no space before -', '- no space before -', 0],
    ['', '', 0],
    ['    ', '', -4],
    // tabs
    ['\t- 1 tab before -', '- 1 tab before -', -1],
    ['\t\t- 2 tabs before -', '\t- 2 tabs before -', -1],
    // mixed
    [' \tfoo', '\tfoo', -1],
    ['\t foo', ' foo', -1],
    ['    \tfoo', '\tfoo', -4],
    ['\t    foo', '    foo', -1],
  ];

  test.each(cases)("unindent '%s' => '%s' with offset %d", (input, expected, offset) => {
    const result = computeUnindent(input, true);
    const actualOffset = result.offset === 0 ? 0 : result.offset; // normalize -0
    expect(result.replaceText).toBe(expected);
    expect(actualOffset).toBe(offset);
  });
});
