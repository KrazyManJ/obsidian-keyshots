import { addCaretDown, addCaretUp } from "@/commands/add-caret";
import { createMockEditor } from "@test/mocks/editor";
import { emptyMarkdownViewMock } from "@test/mocks/markdown-view";
import type { Editor } from "obsidian";

describe(`Command: ${addCaretDown.id}`, () => {
    let editor: jest.Mocked<Editor>;

    beforeEach(() => {
        editor = createMockEditor("Line one\nLine two");
    });

    it("adds caret down", () => {
        addCaretDown.editorCallback?.(editor, emptyMarkdownViewMock);

        expect(editor.listSelections().length).toBe(2);
    });
});

describe(`Command: ${addCaretUp.id}`, () => {
    let editor: jest.Mocked<Editor>;

    beforeEach(() => {
        editor = createMockEditor("Line one\nLine two");
    });

    it("adds caret up", () => {
        editor.setCursor({
            line: 1,
            ch: 0,
        });

        addCaretUp.editorCallback?.(editor, emptyMarkdownViewMock);
        expect(editor.listSelections().length).toBe(2);
    });
});
