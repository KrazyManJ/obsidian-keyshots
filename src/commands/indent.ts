import SelectionsProcessing from "src/classes/SelectionsProcessing"
import { Category } from "src/constants/Category"
import { KeyshotsCommandPluginCallback } from "src/model/KeyshotsCommand"
import { HotKey } from "src/utils"

export const unindentLine = (line: string): string => {
    if (line.startsWith("\t")) return line.slice(1)
    const leadingSpaces = (line.match(/^ */)?.[0] ?? "")
    const spacesToRemove = Math.min(leadingSpaces.length, 4)
    return line.slice(spacesToRemove)
}

export const computeUnindent = (text: string, isCaret: boolean) => {
    if (isCaret) {
        const un = unindentLine(text)
        const removed = text.length - un.length
        return { replaceText: un, offset: -removed }
    }
    const lines = text.split("\n")
    const un = lines.map(unindentLine)
    const removedFirst = lines[0].length - un[0].length
    return { replaceText: un.join("\n"), offset: -removedFirst }
}

export const indent: KeyshotsCommandPluginCallback = (plugin) => ({
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'indent',
    name: "Indent",
    hotkeys: {
        keyshots: [HotKey("]","Alt")]
    },
    editorCallback: (editor) => {
        const useTabs = plugin.app.vault.getConfig("useTabs")
        const indentUnit = (useTabs ?? false) ? '\t' : '    '
        const addedChars = (useTabs ?? false) ? 1 : 4
        // Avoid duplicating line when multiple carets are on the same line
        const processedLines = new Set<number>()

        SelectionsProcessing.selectionsProcessorTransaction(editor, sel => {
            const expandedSelection = sel.clone().normalize().expand();
            if (sel.isCaret()) {
                const lineIdx = sel.anchor.line
                if (!processedLines.has(lineIdx)) {
                    processedLines.add(lineIdx)
                    return {
                        replaceSelection: expandedSelection,
                        replaceText: indentUnit + expandedSelection.getText(),
                        finalSelection: sel.moveCharsWithoutOffset(addedChars)
                    }
                } else {
                    // No replacement for already processed line; just move caret
                    return {
                        finalSelection: sel.moveCharsWithoutOffset(addedChars)
                    }
                }
            }

            const indentedLines = expandedSelection.getText().split("\n").map(line => {
                return indentUnit + line
            })

            return {
                replaceSelection: expandedSelection,
                replaceText: indentedLines.join("\n"),
                finalSelection: sel.moveCharsWithoutOffset(addedChars)
            }
        })
    }
})


export const unindent: KeyshotsCommandPluginCallback = (plugin) => ({
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'unindent',
    name: "Unindent",
    hotkeys: {
        keyshots: [HotKey("[","Alt")]
    },
    editorCallback: (editor) => {
        const useTabs = plugin.app.vault.getConfig("useTabs")
        // Track processed lines to avoid performing unindent multiple times on the same line when multiple carets exist.
        const processedLines = new Set<number>()
        const removedByLine = new Map<number, number>()

        SelectionsProcessing.selectionsProcessorTransaction(editor, sel => {
            const expandedSelection = sel.clone().normalize().expand();
            const originalText = expandedSelection.getText()

            if (sel.isCaret()) {
                const lineIdx = sel.anchor.line
                if (!processedLines.has(lineIdx)) {
                    const unindentedText = unindentLine(originalText)
                    const removedChars = originalText.length - unindentedText.length
                    processedLines.add(lineIdx)
                    removedByLine.set(lineIdx, removedChars)
                    return {
                        replaceSelection: expandedSelection,
                        replaceText: unindentedText,
                        finalSelection: sel.moveCharsWithoutOffset(-removedChars)
                    }
                } else {
                    const removedChars = removedByLine.get(lineIdx) ?? (originalText.length - unindentLine(originalText).length)
                    return {
                        // No text replacement; only move caret to account for removed indentation
                        finalSelection: sel.moveCharsWithoutOffset(-removedChars)
                    }
                }
            }

            const lines = originalText.split("\n")
            const unindentedLines = lines.map(line => unindentLine(line))
            const unindentedText = unindentedLines.join("\n")

            // Calculate how many characters were removed from the first line for cursor positioning
            const firstLineRemovedChars = lines[0].length - unindentedLines[0].length

            return {
                replaceSelection: expandedSelection,
                replaceText: unindentedText,
                finalSelection: sel.moveCharsWithoutOffset(-firstLineRemovedChars)
            }
        })
    }
})
