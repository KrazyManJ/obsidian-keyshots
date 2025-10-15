import {joinLinesMarkdownAware} from "../src/utils";

describe("joinLinesMarkdownAware", () => {
    test("removes leading '>' from joined quote lines", () => {
        const before = `> quote line 2
>quote line 3`;
        const after = `> quote line 2 quote line 3`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });

    test("removes '-' from joined bullet list lines", () => {
        const before = `- item one
- item two`;
        const after = `- item one item two`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });

    test("removes '+' from joined bullet list lines", () => {
        const before = `+ plus one
+ plus two`;
        const after = `+ plus one plus two`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });

    test("removes '*' from joined bullet list lines", () => {
        const before = `* star one
* star two`;
        const after = `* star one star two`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });

    test("removes '1.' style from joined numbered list lines", () => {
        const before = `1. item one
2. item two
10. item three`;
        const after = `1. item one item two item three`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });

    test("removes '- [ ]' from joined checkbox list lines (unchecked)", () => {
        const before = `- [ ] task one
- [ ] task two`;
        const after = `- [ ] task one task two`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });

    test("removes '- [x]' from joined checkbox list lines (checked)", () => {
        const before = `- [x] task one
- [X] task two`;
        const after = `- [x] task one task two`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });

    test("removes both '>' and list marker when quote contains list", () => {
        const before = `> - item one
> - item two`;
        const after = `> - item one item two`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });

    test("ensures single space between pieces regardless of surrounding whitespace", () => {
        const before = `text with trailing
                                     >   -   [ ]   spaced`;
        const after = `text with trailing spaced`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });

    test("preserves leading indentation on first line when joining", () => {
        const before = `    col1 == 'a'
    AND col2 == 'b'`;
        const after = `    col1 == 'a' AND col2 == 'b'`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });
});
