import SelectionsProcessing from "src/classes/SelectionsProcessing"
import { Category } from "src/constants/Category"
import KeyshotsCommand from "src/model/KeyshotsCommand"
import { HotKey } from "src/utils"

export const indent: KeyshotsCommand = {
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'indent',
    name: "Indent",
    hotkeys: {
        keyshots: [HotKey("]","Alt")]
    },
    editorCallback: (editor) => {
        const useTabs = app.vault.getConfig("useTabs")
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
}


export const unindent: KeyshotsCommand = {
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'unindent',
    name: "Unindent",
    hotkeys: {
        keyshots: [HotKey("[","Alt")]
    },
    editorCallback: (editor) => {
        const useTabs = app.vault.getConfig("useTabs")

        const unindentLine = (line: string) => {
            if (useTabs && line.startsWith("\t")) return line.substring(1)
            else if (!useTabs && line.startsWith("    ")) return line.substring(4)
            return line
        }
        
        SelectionsProcessing.selectionsProcessorTransaction(editor, sel => {
            const expandedSelection = sel.clone().normalize().expand();
            if (sel.isCaret()) {
                return {
                    replaceSelection: expandedSelection,
                    replaceText: unindentLine(expandedSelection.getText()),
                    finalSelection: sel.moveCharsWithoutOffset(useTabs ?? false ? -1 : -4)
                }
            }
            return {
                replaceSelection: expandedSelection,
                replaceText: expandedSelection.getText().split("\n").map(line => unindentLine(line)).join("\n"),
                finalSelection: sel.moveCharsWithoutOffset(useTabs ?? false ? -1 : -4)
            }
        })
    }
}