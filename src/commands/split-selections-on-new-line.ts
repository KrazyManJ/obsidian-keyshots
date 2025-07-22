import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import {HotKey} from "../utils";
import SelectionsProcessing from "../classes/SelectionsProcessing";

export const splitSelectionsOnNewLine: KeyshotsCommand = {
    category: Category.TRANSFORM_SELECTIONS,
    id: 'split-selections-on-new-line',
    name: "Split selections on new line",
    hotkeys: {
        keyshots: [HotKey("S", "Alt")]
    },
    editorCallback: (editor) => {
        let index = 0
        SelectionsProcessing.selectionsProcessor(editor, arr => arr.sort((a, b) => a.anchor.line - b.anchor.line), sel => {
            if (sel.isCaret()) return sel
            else {
                const replaceSel = sel.moveLines(index).normalize()
                const tx = replaceSel.getText()
                replaceSel.replaceText("\n" + tx + "\n")
                index += (tx.split("\n") || []).length + 1
                return sel.moveLines(1).expand()
            }
        })
    }
}