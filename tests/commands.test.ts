/* eslint-disable @typescript-eslint/no-non-null-assertion */
// tests/insertTextCommand.test.ts
import { createMockEditor } from "./mocks/editor";
import { insertLineAbove, insertLineBelow } from "../src/commands/insert-line";
import { addCaretDown, addCaretUp } from "../src/commands/add-caret";
import { MarkdownView } from "obsidian";

describe("Commands", () => {
    it(addCaretDown.id, () => {
        const editor = createMockEditor("Line one\nLine two");
        addCaretDown.editorCallback!(editor, {} as MarkdownView);

        expect(editor.listSelections().length).toBe(2);
    });
    it(addCaretUp.id, () => {
        const editor = createMockEditor("Line one\nLine two", {
            initialCursor: {
                line: 1,
                ch: 0,
            },
        });
        addCaretUp.editorCallback!(editor, {} as MarkdownView);

        expect(editor.listSelections().length).toBe(2);
    });

    it(insertLineBelow.id, () => {
        const editor = createMockEditor("Test note text");

        insertLineBelow.editorCallback!(editor, {} as MarkdownView);
        expect(editor.getValue()).toBe("Test note text\n");
    });

    it(insertLineAbove.id, () => {
        const editor = createMockEditor("Test note text");

        insertLineAbove.editorCallback!(editor, {} as MarkdownView);
        expect(editor.getValue()).toBe("\nTest note text");
    });
});
