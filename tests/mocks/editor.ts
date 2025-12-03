import type { Editor, EditorPosition, EditorSelection } from "obsidian";

interface MockEditorOptions {
    initialCursor?: EditorPosition;
    initialSelections?: EditorSelection;
}

export function createMockEditor(
    initialContent = "",
    options: MockEditorOptions = {}
): jest.Mocked<Editor> {
    let content = initialContent;
    const cursorSelection: EditorPosition = options.initialCursor ?? {
        line: 0,
        ch: 0,
    };
    let selections: EditorSelection[] = [
        { anchor: cursorSelection, head: cursorSelection },
    ];

    const posToOffset = jest.fn((pos) => {
        const lines = content.split("\n");
        let offset = 0;
        for (let i = 0; i < pos.line; i++) {
            offset += lines[i].length + 1; // +1 for newline
        }
        offset += pos.ch;
        return offset;
    });

    return {
        getValue: jest.fn(() => content),
        setValue: jest.fn((newValue) => {
            content = newValue
        }),
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

        offsetToPos: jest.fn((offset) => {
            const lines = content.split("\n");
            let remaining = offset;
            for (let line = 0; line < lines.length; line++) {
                const lineLength = lines[line].length;
                if (remaining <= lineLength) {
                    return { line, ch: remaining };
                }
                remaining -= lineLength + 1; // +1 for newline
            }
            // If offset is beyond content, return end of document
            const lastLine = lines.length - 1;
            return { line: lastLine, ch: lines[lastLine].length };
        }),

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
                        content.substring(posToOffset(to));
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
        exec: jest.fn()
    } as Partial<jest.Mocked<Editor>> as jest.Mocked<Editor>;
}