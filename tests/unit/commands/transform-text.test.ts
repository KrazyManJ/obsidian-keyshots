import { createMockEditor } from "@test/mocks/editor";
import type { Editor } from "obsidian";
import { toggleKebabCase } from "@/commands/toggle-kebab-case";
import { toggleSnakeCase } from "@/commands/toggle-snake-case";
import { emptyMarkdownViewMock } from "@test/mocks/markdown-view";

describe(`Transform`, () => {
    let editor: jest.Mocked<Editor>;

    beforeEach(() => {
        editor = createMockEditor("example one", {
            initialSelections: {
                anchor: { line: 0, ch: 0 },
                head: { line: 0, ch: 11 },
            },
        });
    });

    it("spaced casual case replaces to kebab case", () => {
        toggleKebabCase.editorCallback?.(editor, emptyMarkdownViewMock);

        expect(editor.getLine(0)).toBe("example-one");
    });
});
