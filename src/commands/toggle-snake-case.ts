import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import {HotKey} from "../utils";
import SelectionsProcessing from "../classes/SelectionsProcessing";

export const toggleSnakeCase: KeyshotsCommand = {
    category: Category.REPLACE_SELECTIONS,
    id: 'toggle-snake-case',
    name: "Toggle selections snakecase",
    hotkeys: {
        keyshots: [HotKey("-", "Shift", "Alt")]
    },
    editorCallback: (editor) =>
        SelectionsProcessing.convertOneToOtherChars(editor, " ", "_")
}