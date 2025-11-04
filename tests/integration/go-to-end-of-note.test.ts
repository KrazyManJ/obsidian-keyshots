import { goToEndOfNote } from "@/commands/go-to-end-of-note";
import { createMockEditor } from "@test/mocks/editor";
import { emptyMarkdownViewMock } from "@test/mocks/markdown-view";
import { EditorCommandName } from "obsidian";

describe(goToEndOfNote.id, () => {
    test(`Command uses native exec with parameter "goEnd"`, () => {
        const editor = createMockEditor();

        goToEndOfNote.editorCallback?.(editor, emptyMarkdownViewMock);

        expect(editor.exec).toHaveBeenCalledWith<[EditorCommandName]>("goEnd");
    });
});
