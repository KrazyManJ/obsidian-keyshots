import { insertLineAbove, insertLineBelow } from "@/commands/insert-line";
import { createMockEditor } from "@test/mocks/editor";
import { emptyMarkdownViewMock } from "@test/mocks/markdown-view";
import type { Editor } from "obsidian";

describe("Commands", () => {
    let editor: jest.Mocked<Editor>;

    beforeEach(() => {
        editor = createMockEditor("Test note text");
    });

    test(insertLineBelow.id, () => {
        insertLineBelow.editorCallback?.(editor, emptyMarkdownViewMock);

        expect(editor.getValue()).toBe("Test note text\n");
    });

    test(insertLineAbove.id, () => {
        insertLineAbove.editorCallback?.(editor, emptyMarkdownViewMock);

        expect(editor.getValue()).toBe("\nTest note text");
    });
});
