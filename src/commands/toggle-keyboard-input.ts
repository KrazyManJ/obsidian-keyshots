import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import {HotKey} from "../utils";
import SelectionsProcessing from "../classes/SelectionsProcessing";


export const toggleKeyboardInput: KeyshotsCommand = {
    category: Category.REPLACE_SELECTIONS,
    id: 'toggle-keyboard-input',
    name: "Toggle keyboard input (<kbd>)",
    hotkeys: {
        keyshots: [HotKey("K", "Mod", "Shift")]
    },
    editorCallback: (editor) =>
        SelectionsProcessing.surroundWithChars(editor, "<kbd>", "</kbd>")
}