import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import {HotKey} from "../utils";
import SelectionsProcessing from "../classes/SelectionsProcessing";

export const toggleKebabCase: KeyshotsCommand = {
    category: Category.REPLACE_SELECTIONS,
    id: 'toggle-kebab-case',
    name: "Toggle selections kebabcase",
    hotkeys: {
        keyshots: [HotKey("-", "Alt")]
    },
    editorCallback: (editor) =>
        SelectionsProcessing.convertOneToOtherChars(editor, " ", "-")
}