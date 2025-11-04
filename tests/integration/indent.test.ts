import { indent, unindent } from "@/commands/indent";
import { createMockEditor } from "@test/mocks/editor";
import { emptyMarkdownViewMock } from "@test/mocks/markdown-view";
import type { Editor, EditorCommandName } from "obsidian";

describe("Indent commands", () => {
    let editor: jest.Mocked<Editor>;

    beforeEach(() => {
        editor = createMockEditor();
    });

    test(indent.id, () => {
        indent.editorCallback?.(editor, emptyMarkdownViewMock);

        expect(editor.exec).toHaveBeenCalledWith<[EditorCommandName]>(
            "indentMore"
        );
    });

    test(unindent.id, () => {
        unindent.editorCallback?.(editor, emptyMarkdownViewMock);

        expect(editor.exec).toHaveBeenCalledWith<[EditorCommandName]>(
            "indentLess"
        );
    });
});
