import type {
    Editor,
    EditorPosition,
    EditorSelection
} from "obsidian";

interface MockEditorOptions {
    initialCursor?: EditorPosition,
    initialSelections?: EditorSelection
}

export function createMockEditor(initialContent = "", options: MockEditorOptions = {}): Editor {
    let content = initialContent
    let cursor: EditorPosition = options.initialCursor ?? { line: 0, ch: 0 }
    let selections: EditorSelection[] = [{anchor: cursor, head: cursor}]

    const posToOffset = jest.fn((pos) => {  
        const lines = content.split("\n").slice(0, pos.line+1)
        lines[lines.length-1] = lines[lines.length-1].substring(0,pos.ch)
        return lines.reduce((acc, curr) => acc + curr.length, 0)
    })

    return {
        getValue: jest.fn(() => content),
        setValue: jest.fn((newValue) => content = newValue),

        listSelections: jest.fn(() => selections),
        setSelections: jest.fn((ranges) => selections = ranges.map<EditorSelection>(range => ({
            anchor: range.anchor,
            head: range.head ?? range.anchor
        }))),

        getCursor: jest.fn(() => cursor),
        setCursor: jest.fn((pos, ch) => cursor = typeof pos === "number" ? {line: pos, ch: ch ?? pos} : pos),

        posToOffset: posToOffset,

        getLine: jest.fn((line) => content.split("\n")[line]),
        getRange: jest.fn((from, to) => content.substring(posToOffset(from),posToOffset(to))),

        lineCount: jest.fn(() => content.split("\n").length),

        scrollIntoView: jest.fn(),
        
        transaction: jest.fn((tx) => {
            if (tx.changes) {
                tx.changes.forEach(change => {
                    const to = change.to ?? change.from
                    content = content.substring(0,posToOffset(change.from)) 
                        + change.text 
                        + content.substring(posToOffset(to) + change.text.length)
                })
            }
            if (tx.selections) {
                selections = tx.selections.map<EditorSelection>(editorRangeOrCaret => {
                    return {
                        anchor: editorRangeOrCaret.from, 
                        head: editorRangeOrCaret.to ?? editorRangeOrCaret.from
                    }
                })
            }
            else if (tx.selection) {
                selections = [{anchor: tx.selection.from, head: tx.selection.to ?? tx.selection.from}]
            }
        }),
    } as Partial<Editor> as Editor;
}
