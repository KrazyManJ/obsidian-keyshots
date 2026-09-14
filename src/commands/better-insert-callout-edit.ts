import type {
    CalloutCursorPosition,
    CalloutCursorPositionWithoutSelection
} from "../model/KeyshotsSettings";

export interface CalloutPosition {
    line: number;
    ch: number;
}

export interface CalloutSelection {
    anchor: CalloutPosition;
    head: CalloutPosition;
}

export interface CalloutEditor {
    getLine(line: number): string | undefined;
}

export interface CalloutEditOptions {
    calloutId: string;
    foldingState: "" | "+" | "-";
    prependLineBreak: boolean;
    cursorPosition: CalloutCursorPosition;
}

export interface CalloutEdit {
    from: CalloutPosition;
    to: CalloutPosition;
    text: string;
    cursor: CalloutPosition;
}

const isBefore = (left: CalloutPosition, right: CalloutPosition) =>
    left.line < right.line || (left.line === right.line && left.ch <= right.ch)

const isQuoteLine = (line: string | undefined) => line !== undefined && /^>\s?/.test(line)

const quoteLine = (line: string) => isQuoteLine(line) ? line : `> ${line}`

const quoteContentStart = (line: string) => line.match(/^>\s?/)?.[0].length ?? 0

export const resolveCalloutCursorPosition = (
    selection: CalloutSelection,
    withSelection: CalloutCursorPosition,
    withoutSelection: CalloutCursorPositionWithoutSelection
): CalloutCursorPosition => {
    const hasSelection = selection.anchor.line !== selection.head.line || selection.anchor.ch !== selection.head.ch
    if (hasSelection) return withSelection
    return withoutSelection === "content" ? "start" : "title"
}

export const createCalloutEdit = (
    editor: CalloutEditor,
    selection: CalloutSelection,
    options: CalloutEditOptions
): CalloutEdit => {
    const [start, end] = isBefore(selection.anchor, selection.head)
        ? [selection.anchor, selection.head]
        : [selection.head, selection.anchor]
    const from = {line: start.line, ch: 0}
    const selectedLines = Array.from(
        {length: end.line - start.line + 1},
        (_, index) => editor.getLine(start.line + index) ?? ""
    )
    const quotedLinesBelow: string[] = []
    let nextLine = end.line + 1
    while (isQuoteLine(editor.getLine(nextLine))) {
        quotedLinesBelow.push(editor.getLine(nextLine) ?? "")
        nextLine++
    }
    const hasQuoteBelow = quotedLinesBelow.length > 0
    const omitBlankSelection = hasQuoteBelow && selectedLines.every(line => line.trim().length === 0)
    const selectedBodyLines = omitBlankSelection ? [] : selectedLines.map(quoteLine)
    const bodyLines = selectedBodyLines.concat(quotedLinesBelow)
    const replacementEndLine = end.line + quotedLinesBelow.length
    const to = {line: replacementEndLine, ch: editor.getLine(replacementEndLine)?.length ?? 0}
    const header = `>[!${options.calloutId}]${options.foldingState}`
    const body = `\n${bodyLines.join("\n")}`
    const leadingLineBreak = options.prependLineBreak ? "\n" : ""
    const trailingLineBreak = !hasQuoteBelow || options.cursorPosition === "below" ? "\n" : ""
    const headerLine = start.line + (options.prependLineBreak ? 1 : 0)
    const bodyStartLine = headerLine + 1
    const cursors: Record<CalloutCursorPosition, CalloutPosition> = {
        start: {line: bodyStartLine, ch: quoteContentStart(bodyLines[0])},
        end: {line: bodyStartLine + bodyLines.length - 1, ch: bodyLines[bodyLines.length - 1].length},
        title: {line: headerLine, ch: header.length},
        below: {line: bodyStartLine + bodyLines.length, ch: 0}
    }

    return {
        from,
        to,
        text: `${leadingLineBreak}${header}${body}${trailingLineBreak}`,
        cursor: cursors[options.cursorPosition]
    }
}
