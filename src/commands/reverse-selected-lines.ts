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
    editorCallback: (editor) => {
        SelectionsProcessing.selectionsProcessorTransaction(editor, sel => {
            return {
                replaceSelection: sel.clone().expand(),
                replaceText: sel.clone().expand().getText().split("\n").reverse().join("\n")
            }
        }, arr => arr.filter(sel => !sel.isCaret()))
    }
}