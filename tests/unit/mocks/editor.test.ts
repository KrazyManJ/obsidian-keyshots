import {createMockEditorFromTextWithCaret, parseCaretPosition,} from "@test/mocks/editor";

describe("parseCaretPosition", () => {
    it("returns correct position for caret on first line", () => {
        const position = parseCaretPosition("- [ ] ttt   |");
        expect(position).toEqual({line: 0, ch: 12});
    });

    it("returns correct position for caret on second line", () => {
        const position = parseCaretPosition(`first line
second |line`);
        expect(position).toEqual({line: 1, ch: 7});
    });

    it("returns correct position for caret at start of line", () => {
        const position = parseCaretPosition("|start");
        expect(position).toEqual({line: 0, ch: 0});
    });

    it("throws error when no caret marker is found", () => {
        expect(() => parseCaretPosition("no caret here")).toThrow(
            "No caret marker '|' found in text"
        );
    });
});

describe("createMockEditorFromTextWithCaret", () => {
    it("returns correct position for caret on first line", () => {
        const editor = createMockEditorFromTextWithCaret(`- [ ] ttt   |
- [ ] 
- [ ] ➕ 2025-11-21`);

        const cursor = editor.getCursor();
        expect(cursor.line).toBe(0);
        expect(cursor.ch).toBe(12);
    });

    it("removes the caret marker from content", () => {
        const editor = createMockEditorFromTextWithCaret(`- [ ] ttt   |
- [ ] 
- [ ] ➕ 2025-11-21`);

        expect(editor.getValue()).toBe(`- [ ] ttt   
- [ ] 
- [ ] ➕ 2025-11-21`);
    });

    it("returns correct position for caret on second line", () => {
        const editor = createMockEditorFromTextWithCaret(`first line
second| line
third line`);

        const cursor = editor.getCursor();
        expect(cursor.line).toBe(1);
        expect(cursor.ch).toBe(6);
        expect(editor.getValue()).toBe(`first line
second line
third line`);
    });
});

describe("getValueWithCaret", () => {
    it("returns content with caret marker at cursor position", () => {
        const editor = createMockEditorFromTextWithCaret(`- [ ] ttt   |
- [ ] 
- [ ] ➕ 2025-11-21`);

        expect(editor.getValueWithCaret()).toBe(`- [ ] ttt   |
- [ ] 
- [ ] ➕ 2025-11-21`);
    });

    it("reflects updated cursor position after setCursor", () => {
        const editor = createMockEditorFromTextWithCaret(`first| line
second line`);

        editor.setCursor({line: 1, ch: 3});

        expect(editor.getValueWithCaret()).toBe(`first line
sec|ond line`);
    });
});
