import {
    CalloutEdit,
    createCalloutEdit,
    resolveCalloutCursorPosition
} from "@/commands/better-insert-callout-edit";

const createEditor = (content: string) => ({
    getLine: (line: number) => content.split("\n")[line]
})

const positionToOffset = (content: string, line: number, ch: number) => {
    const lines = content.split("\n")
    return lines.slice(0, line).reduce((offset, value) => offset + value.length + 1, 0) + ch
}

const applyEdit = (content: string, edit: CalloutEdit) => {
    const from = positionToOffset(content, edit.from.line, edit.from.ch)
    const to = positionToOffset(content, edit.to.line, edit.to.ch)
    return content.substring(0, from) + edit.text + content.substring(to)
}

describe("Better insert callout text edit", () => {
    it("creates a standalone callout when there is no quote below", () => {
        const content = "ABC\nnext"
        const edit = createCalloutEdit(
            createEditor(content),
            {anchor: {line: 0, ch: 1}, head: {line: 0, ch: 2}},
            {calloutId: "note", foldingState: "", prependLineBreak: true, cursorPosition: "start"}
        )

        expect(edit.from).toEqual({line: 0, ch: 0})
        expect(edit.to).toEqual({line: 0, ch: 3})
        expect(applyEdit(content, edit)).toBe("\n>[!note]\n> ABC\n\nnext")
        expect(edit.cursor).toEqual({line: 2, ch: 2})
    })

    it("places a callout above and absorbs the existing quote block", () => {
        const content = "\n> first quote\n> second quote\nafter"
        const edit = createCalloutEdit(
            createEditor(content),
            {anchor: {line: 0, ch: 0}, head: {line: 0, ch: 0}},
            {calloutId: "info", foldingState: "+", prependLineBreak: false, cursorPosition: "start"}
        )

        expect(applyEdit(content, edit)).toBe(">[!info]+\n> first quote\n> second quote\nafter")
        expect(edit.to).toEqual({line: 2, ch: 14})
        expect(edit.cursor).toEqual({line: 1, ch: 2})
    })

    it("wraps the complete selected line and absorbs the quote below it", () => {
        const content = "ABC\n> existing quote"
        const edit = createCalloutEdit(
            createEditor(content),
            {anchor: {line: 0, ch: 1}, head: {line: 0, ch: 2}},
            {calloutId: "warning", foldingState: "-", prependLineBreak: false, cursorPosition: "start"}
        )

        expect(applyEdit(content, edit)).toBe(">[!warning]-\n> ABC\n> existing quote")
    })

    it("omits the preceding line break when the option is disabled", () => {
        const content = "ABC"
        const edit = createCalloutEdit(
            createEditor(content),
            {anchor: {line: 0, ch: 1}, head: {line: 0, ch: 2}},
            {calloutId: "tip", foldingState: "", prependLineBreak: false, cursorPosition: "start"}
        )

        expect(applyEdit(content, edit)).toBe(">[!tip]\n> ABC\n")
        expect(edit.cursor).toEqual({line: 1, ch: 2})
    })

    it("places the cursor at the end of the absorbed callout", () => {
        const content = "ABC\n> first quote\n> second quote\nafter"
        const edit = createCalloutEdit(
            createEditor(content),
            {anchor: {line: 0, ch: 0}, head: {line: 0, ch: 3}},
            {calloutId: "note", foldingState: "", prependLineBreak: false, cursorPosition: "end"}
        )

        expect(edit.cursor).toEqual({line: 3, ch: 14})
    })

    it("places the cursor after the callout marker and folding state for a title", () => {
        const content = "ABC"
        const edit = createCalloutEdit(
            createEditor(content),
            {anchor: {line: 0, ch: 0}, head: {line: 0, ch: 3}},
            {calloutId: "warning", foldingState: "-", prependLineBreak: true, cursorPosition: "title"}
        )

        expect(edit.cursor).toEqual({line: 1, ch: 12})
    })

    it("creates a blank line below the absorbed callout and places the cursor there", () => {
        const content = "ABC\n> existing quote\nafter"
        const edit = createCalloutEdit(
            createEditor(content),
            {anchor: {line: 0, ch: 0}, head: {line: 0, ch: 3}},
            {calloutId: "tip", foldingState: "", prependLineBreak: false, cursorPosition: "below"}
        )

        expect(applyEdit(content, edit)).toBe(">[!tip]\n> ABC\n> existing quote\n\nafter")
        expect(edit.cursor).toEqual({line: 3, ch: 0})
    })
})

describe("Better insert callout cursor setting", () => {
    it("uses the selected-text position when text is selected", () => {
        expect(resolveCalloutCursorPosition(
            {anchor: {line: 0, ch: 0}, head: {line: 0, ch: 3}},
            "below",
            "content"
        )).toBe("below")
    })

    it("uses the content position for an empty selection", () => {
        expect(resolveCalloutCursorPosition(
            {anchor: {line: 0, ch: 1}, head: {line: 0, ch: 1}},
            "below",
            "content"
        )).toBe("start")
    })

    it("uses the title position for an empty selection", () => {
        expect(resolveCalloutCursorPosition(
            {anchor: {line: 0, ch: 1}, head: {line: 0, ch: 1}},
            "end",
            "title"
        )).toBe("title")
    })
})
