import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import {convertOneToOtherChars, HotKey} from "../utils";

export const toggleSnakeCase: KeyshotsCommand = {
    category: Category.REPLACE_SELECTIONS,
    id: 'toggle-snake-case',
    name: "Toggle selections snakecase",
    hotkeys: {
        keyshots: [HotKey("-", "Shift", "Alt")]
    },
    editorCallback: (editor) =>
        convertOneToOtherChars(editor, " ", "_")
}