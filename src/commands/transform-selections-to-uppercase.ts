import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import {HotKey} from "../utils";
import SelectionsProcessing from "../classes/SelectionsProcessing";

export const transformSelectionsToUppercase: KeyshotsCommand = {
    category: Category.REPLACE_SELECTIONS,
    id: 'transform-selections-to-uppercase',
    name: "Transform selections to uppercase",
    hotkeys: {
        keyshots: [HotKey("U", "Alt")],
        visual_studio: [HotKey("U", "Mod", "Shift")],
    },
    editorCallback: (editor) => SelectionsProcessing.selectionsReplacer(
        editor, (s) => s.toUpperCase()
    )
}