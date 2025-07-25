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
        SelectionsProcessing.selectionsProcessorTransaction(editor, sel => {
            if (sel.isCaret()) {
                return {
                    finalSelection: sel
                }
            }
            return {
                replaceSelection: sel,
                replaceText: "\n" + sel.getText() + "\n",
                finalSelection: sel.moveCharsWithoutOffset(1,0)
            }
        })
    }
}