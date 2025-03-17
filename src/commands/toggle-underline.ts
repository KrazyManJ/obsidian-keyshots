import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import {HotKey, surroundWithChars} from "../utils";


export const toggleUnderline: KeyshotsCommand = {
    category: Category.REPLACE_SELECTIONS,
    id: 'toggle-underline',
    name: "Toggle underline",
    hotkeys: {
        keyshots: [HotKey("N", "Alt")]
    },
    editorCallback: (editor) =>
        surroundWithChars(editor, "<u>", "</u>")
}