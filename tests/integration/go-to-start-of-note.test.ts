import { goToStartOfNote } from "@/commands/go-to-start-of-note";
import { createMockEditor } from "@test/mocks/editor";
import { emptyMarkdownViewMock } from "@test/mocks/markdown-view";
import { EditorCommandName } from "obsidian";

describe(goToStartOfNote.id, () => {
    test(`Command uses native exec with parameter "goStart"`, () => {
        const editor = createMockEditor();

        goToStartOfNote.editorCallback?.(editor, emptyMarkdownViewMock);

        expect(editor.exec).toHaveBeenCalledWith<[EditorCommandName]>(
            "goStart"
        );
    });
});
