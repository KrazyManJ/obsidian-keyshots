import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import {HotKey} from "../utils";

export const insertOrdinalNumbering: KeyshotsCommand = {
    category: Category.INSERT_COMPONENTS,
    id: 'insert-ordinal-numbering',
    name: "Insert ordinal numbering",
    hotkeys: {
        keyshots: [HotKey("N", "Shift", "Alt")]
    },
    editorCallback: (editor) => {
        SelectionsProcessing.selectionsProcessorTransaction(editor, (sel, index) => {
            return {
                replaceSelection: sel,
                replaceText: (index + 1).toString()
            }
        })
    }
}