import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import {HotKey, surroundWithChars} from "../utils";

export const toggleKeyboardInput: KeyshotsCommand = {
    category: Category.REPLACE_SELECTIONS,
    id: 'toggle-keyboard-input',
    name: "Toggle keyboard input (<kbd>)",
    hotkeys: {
        keyshots: [HotKey("K", "Mod", "Shift")]
    },
    editorCallback: (editor) =>
        surroundWithChars(editor, "<kbd>", "</kbd>")
}