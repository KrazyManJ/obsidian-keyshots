import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import {HotKey} from "../utils";
import SelectionsProcessing from "../classes/SelectionsProcessing";

export const transformSelectionsToLowercase: KeyshotsCommand = {
    category: Category.REPLACE_SELECTIONS,
    id: 'transform-selections-to-lowercase',
    name: "Transform selections to lowercase",
    hotkeys: {
        keyshots: [HotKey("L", "Alt")],
        visual_studio: [HotKey("U", "Mod")],
    },
    editorCallback: (editor) => SelectionsProcessing.selectionsReplacer(
        editor, (s) => s.toLowerCase()
    )
}