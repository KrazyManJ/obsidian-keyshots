import { indent, unindent } from "@/commands/indent";
import { createMockEditor } from "@test/mocks/editor";
import { emptyMarkdownViewMock } from "@test/mocks/markdown-view";
import type { EditorCommandName } from "obsidian";

describe(`Command: ${indent.id}`, () => {
    it(`uses native exec editor method with parameter "indentMore"`, () => {
        const editor = createMockEditor();

        indent.editorCallback?.(editor, emptyMarkdownViewMock);

        expect(editor.exec).toHaveBeenCalledWith<[EditorCommandName]>(
            "indentMore"
        );
    });
});

describe(`Command: ${unindent.id}`, () => {
    it(`uses native exec editor method with parameter "indentLess"`, () => {
        const editor = createMockEditor();

        unindent.editorCallback?.(editor, emptyMarkdownViewMock);

        expect(editor.exec).toHaveBeenCalledWith<[EditorCommandName]>(
            "indentLess"
        );
    });
});
