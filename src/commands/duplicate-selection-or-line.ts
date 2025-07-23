import {Category} from "../constants/Category";
import KeyshotsCommand from "../model/KeyshotsCommand";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import {HotKey} from "../utils";

export const duplicateSelectionOrLine: KeyshotsCommand = {
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'duplicate-selection-or-line',
    name: 'Duplicate selection or line (JetBrains IDEs)',
    repeatable: true,
    hotkeys: {
        keyshots: [HotKey("D", "Mod", "Alt")],
        vscode: null,
        jetbrains: [HotKey("D", "Mod")],
        visual_studio: [HotKey("D", "Mod")],
    },
    editorCallback: (editor) => {
        SelectionsProcessing.selectionsProcessor(editor, undefined, (sel) => {
            if (sel.isCaret()) {
                const tx = sel.anchor.getLine()
                sel.anchor.setLine(tx + "\n" + tx)
                return sel.moveLines(1).withLineDifference(1)
            } else {
                const tx = sel.asNormalized().getText()
                return sel.asNormalized().replaceText(tx + tx).moveChars(tx.length)
            }
        })
    }
}