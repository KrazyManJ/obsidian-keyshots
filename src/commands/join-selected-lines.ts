import {Category} from "../constants/Category";
import KeyshotsCommand from "../model/KeyshotsCommand";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import {HotKey} from "../utils";

export const joinSelectedLines: KeyshotsCommand = {
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'join-selected-lines',
    name: "Join selected lines",
    hotkeys: {
        keyshots: [HotKey("J", "Mod", "Shift")],
        vscode: [HotKey("J", "Mod")],
        jetbrains: [HotKey("J", "Mod", "Shift")]

    },
    editorCallback: (editor) => {
        SelectionsProcessing.selectionsProcessor(editor, undefined, sel => {
            if (sel.isCaret() || sel.isOneLine()) {
                if (sel.anchor.line === editor.lineCount()-1) {
                    return sel
                }
                const start = sel.anchor.ch
                const length = sel.getText().length
                const currentLineLength = editor.getLine(sel.anchor.line).length

                const expandedSelection = sel.clone().moveLines(0,1).expand()
                expandedSelection.replaceText(expandedSelection.getText().replace(/\n/g, " "))

                if (sel.isOneLine()) return expandedSelection.moveLines(0,-1).moveChars(start,length-start)

                return sel.clone().setChars(currentLineLength,currentLineLength)
            }

            const len = sel.getText().length
            return sel.replaceText(sel.getText().replace(/\n/g," ")).setLines(sel.anchor.line).moveChars(0,len)
        })
    }
}