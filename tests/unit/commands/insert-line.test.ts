import { insertLineAbove, insertLineBelow } from "@/commands/insert-line";
import { createMockEditor } from "@test/mocks/editor";
import { emptyMarkdownViewMock } from "@test/mocks/markdown-view";
import type { Editor } from "obsidian";

describe(`Command: ${insertLineBelow.id}`, () => {
    let editor: jest.Mocked<Editor>;

    beforeEach(() => {
        editor = createMockEditor("Test note text");
    });

    it(insertLineBelow.id, () => {
        insertLineBelow.editorCallback?.(editor, emptyMarkdownViewMock);

        expect(editor.getValue()).toBe("Test note text\n");
    });
});

describe(`Command: ${insertLineAbove.id}`, () => {
    let editor: jest.Mocked<Editor>;

    beforeEach(() => {
        editor = createMockEditor("Test note text");
    });

    it(insertLineAbove.id, () => {
        insertLineAbove.editorCallback?.(editor, emptyMarkdownViewMock);

        expect(editor.getValue()).toBe("\nTest note text");
    });
});
