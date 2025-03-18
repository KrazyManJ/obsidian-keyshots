import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import {HotKey} from "../utils";
import SelectionsProcessing from "../classes/SelectionsProcessing";


export const toggleUnderline: KeyshotsCommand = {
    category: Category.REPLACE_SELECTIONS,
    id: 'toggle-underline',
    name: "Toggle underline",
    hotkeys: {
        keyshots: [HotKey("N", "Alt")]
    },
    editorCallback: (editor) =>
        SelectionsProcessing.surroundWithChars(editor, "<u>", "</u>")
}