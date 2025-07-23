import {Category} from "../constants/Category";
import KeyshotsCommand from "../model/KeyshotsCommand";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import {HotKey} from "../utils";

export const reverseSelectedLines: KeyshotsCommand = {
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'reverse-selected-lines',
    name: "Reverse selected lines",
    hotkeys: {
        keyshots: [HotKey("R", "Alt")]
    },
    editorCallback: (editor) => SelectionsProcessing.selectionsProcessor(editor, arr => arr.filter(s => !s.isCaret()), sel => {
        const replaceSel = sel.asNormalized().expand()
        replaceSel.replaceText(replaceSel.getText().split("\n").reverse().join("\n"))
        return sel
    })
}