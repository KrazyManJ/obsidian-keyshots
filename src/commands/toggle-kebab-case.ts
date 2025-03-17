import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import {convertOneToOtherChars, HotKey} from "../utils";

export const toggleKebabCase: KeyshotsCommand = {
    category: Category.REPLACE_SELECTIONS,
    id: 'toggle-kebab-case',
    name: "Toggle selections kebabcase",
    hotkeys: {
        keyshots: [HotKey("-", "Alt")]
    },
    editorCallback: (editor) =>
        convertOneToOtherChars(editor, " ", "-")
}