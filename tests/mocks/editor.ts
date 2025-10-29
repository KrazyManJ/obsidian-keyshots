import type { Editor, EditorPosition, EditorSelection } from "obsidian";

interface MockEditorOptions {
    initialCursor?: EditorPosition;
    initialSelections?: EditorSelection;
}

export function createMockEditor(
    initialContent = "",
    options: MockEditorOptions = {}
): Editor {
    let content = initialContent;
    const cursorSelection: EditorPosition = options.initialCursor ?? {
        line: 0,
        ch: 0,
    };
    let selections: EditorSelection[] = [
        { anchor: cursorSelection, head: cursorSelection },
    ];

    const posToOffset = jest.fn((pos) => {
        const lines = content.split("\n").slice(0, pos.line + 1);
        lines[lines.length - 1] = lines[lines.length - 1].substring(0, pos.ch);
        return lines.reduce((acc, curr) => acc + curr.length, 0);
    });

    return {
        getValue: jest.fn(() => content),
        setValue: jest.fn((newValue) => (content = newValue)),

        listSelections: jest.fn(() => selections),
        setSelections: jest.fn((ranges) => {
            selections = ranges.map<EditorSelection>((range) => ({
                anchor: range.anchor,
                head: range.head ?? range.anchor,
            }));
        }),

        getCursor: jest.fn((string) => {
            if (string === "head") {
                return selections[0].head;
            }
            const { anchor, head } = selections[0];
            const [anchorOffset, headOffset] = [
                posToOffset(anchor),
                posToOffset(head),
            ];
            if (string === "from") {
                return anchorOffset < headOffset ? anchor : head;
            }
            if (string === "to") {
                return anchorOffset < headOffset ? head : anchor;
            }
            return selections[0].anchor;
        }),
        setCursor: jest.fn((pos, ch) => {
            const cursor =
                typeof pos === "number" ? { line: pos, ch: ch ?? pos } : pos;
            selections[0] = { anchor: cursor, head: cursor };
        }),

        posToOffset: posToOffset,

        getLine: jest.fn((line) => content.split("\n")[line]),
        getRange: jest.fn((from, to) =>
            content.substring(posToOffset(from), posToOffset(to))
        ),

        lineCount: jest.fn(() => content.split("\n").length),

        scrollIntoView: jest.fn(),

        transaction: jest.fn((tx) => {
            if (tx.changes) {
                tx.changes.forEach((change) => {
                    const to = change.to ?? change.from;
                    content =
                        content.substring(0, posToOffset(change.from)) +
                        change.text +
                        content.substring(posToOffset(to) + change.text.length);
                });
            }
            if (tx.selections) {
                selections = tx.selections.map<EditorSelection>(
                    (editorRangeOrCaret) => {
                        return {
                            anchor: editorRangeOrCaret.from,
                            head:
                                editorRangeOrCaret.to ??
                                editorRangeOrCaret.from,
                        };
                    }
                );
            } else if (tx.selection) {
                selections = [
                    {
                        anchor: tx.selection.from,
                        head: tx.selection.to ?? tx.selection.from,
                    },
                ];
            }
        }),
    } as Partial<Editor> as Editor;
}
