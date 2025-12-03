import {
    joinLinesMarkdownAware,
    joinSelectedLines,
} from "@/commands/join-selected-lines";
import { createMockEditor } from "@test/mocks/editor";
import { emptyMarkdownViewMock } from "@test/mocks/markdown-view";

describe(`Command: ${joinSelectedLines.id}`, () => {
    describe("caret position after join without text selection should be at the end of the first line, first line being trimmed", () => {
        it("test", () => {
            /*
             Initial: 
             """
             - [ ] ttt   |
             - [ ] 
             """
             Expected: 
             """
             - [ ] ttt|
             """
            */
            const initialContent = `- [ ] ttt   
- [ ] 
- [ ] ➕ 2025-11-21`;
            const editor = createMockEditor(initialContent, {
                initialCursor: { line: 0, ch: 12 },
            });

            joinSelectedLines.editorCallback?.(editor, emptyMarkdownViewMock);

            expect(editor.getValue()).toBe(`- [ ] ttt
- [ ] ➕ 2025-11-21`);

            const selections = editor.listSelections();
            expect(selections[0].anchor.line).toBe(0);
            expect(selections[0].anchor.ch).toBe(9);
            expect(selections[0].head.line).toBe(0);
            expect(selections[0].head.ch).toBe(9);
        });
    });

    it("removes leading '>' from joined quote lines", () => {
        const before = `> quote line 2
>quote line 3`;
        const after = `> quote line 2 quote line 3`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });

    it("removes '-' from joined bullet list lines", () => {
        const before = `- item one
- item two`;
        const after = `- item one item two`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });

    it("removes '+' from joined bullet list lines", () => {
        const before = `+ plus one
+ plus two`;
        const after = `+ plus one plus two`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });

    it("removes '*' from joined bullet list lines", () => {
        const before = `* star one
* star two`;
        const after = `* star one star two`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });

    it("removes '1.' style from joined numbered list lines", () => {
        const before = `1. item one
2. item two
10. item three`;
        const after = `1. item one item two item three`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });

    it("removes '- [ ]' from joined checkbox list lines (unchecked)", () => {
        const before = `- [ ] task one
- [ ] task two`;
        const after = `- [ ] task one task two`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });

    it("removes '- [x]' from joined checkbox list lines (checked)", () => {
        const before = `- [x] task one
- [X] task two`;
        const after = `- [x] task one task two`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });
    
    it("line with checkbox and no other content on next line 1", () => {
        const before = `- [ ] ttt
- [ ] `;
        const after = `- [ ] ttt`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });

    it("line with checkbox and no other content on next line 2", () => {
        const before = `- [ ] ttt
- [x] `;
        const after = `- [ ] ttt`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });

    it("line with checkbox and no other content on next line 3", () => {
        const before = `- [x] ttt
- [x] `;
        const after = `- [x] ttt`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });
    
    it("removes both '>' and list marker when quote contains list", () => {
        const before = `> - item one
> - item two`;
        const after = `> - item one item two`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });

    it("ensures single space between pieces regardless of surrounding whitespace", () => {
        const before = `text with trailing
                                     >   -   [ ]   spaced`;
        const after = `text with trailing spaced`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });

    it("preserves leading indentation on first line when joining", () => {
        const before = `    col1 == 'a'
    AND col2 == 'b'`;
        const after = `    col1 == 'a' AND col2 == 'b'`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });

    it("join on empty line", () => {
        const before = `
            text`;
        const after = `text`;
        expect(joinLinesMarkdownAware(before)).toBe(after);
    });
});