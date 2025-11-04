import { addCaretDown, addCaretUp } from "@/commands/add-caret";
import { createMockEditor } from "@test/mocks/editor";
import { emptyMarkdownViewMock } from "@test/mocks/markdown-view";
import type { Editor } from "obsidian";

describe("Add carets command", () => {
    let editor: jest.Mocked<Editor>;

    beforeEach(() => {
        editor = createMockEditor("Line one\nLine two");
    });

    test(addCaretDown.id, () => {
        addCaretDown.editorCallback?.(editor, emptyMarkdownViewMock);

        expect(editor.listSelections().length).toBe(2);
    });
    test(addCaretUp.id, () => {
        editor.setCursor({
            line: 1,
            ch: 0,
        });

        addCaretUp.editorCallback?.(editor, emptyMarkdownViewMock);
        expect(editor.listSelections().length).toBe(2);
    });
});
