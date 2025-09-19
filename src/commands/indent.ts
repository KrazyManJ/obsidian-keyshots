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
        SelectionsProcessing.selectionsProcessorTransaction(editor, sel => {
            const expandedSelection = sel.clone().normalize().expand();
            if (sel.isCaret()) {
                return {
                    replaceSelection: expandedSelection,
                    replaceText: (useTabs ?? false ? '\t' : '    ')+expandedSelection.getText(),
                    finalSelection: sel.moveCharsWithoutOffset(useTabs ?? false ? 1 : 4)
                }
            }

            const indentedLines = expandedSelection.getText().split("\n").map(line => {
                return (useTabs ?? false ? '\t' : '    ')+line
            })

            return {
                replaceSelection: expandedSelection,
                replaceText: indentedLines.join("\n"),
                finalSelection: sel.moveCharsWithoutOffset((useTabs ?? false ? 1 : 4))
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

        SelectionsProcessing.selectionsProcessorTransaction(editor, sel => {
            const expandedSelection = sel.clone().normalize().expand();
            const originalText = expandedSelection.getText()

            if (sel.isCaret()) {
                const unindentedText = unindentLine(originalText)
                const removedChars = originalText.length - unindentedText.length
                return {
                    replaceSelection: expandedSelection,
                    replaceText: unindentedText,
                    finalSelection: sel.moveCharsWithoutOffset(-removedChars)
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
