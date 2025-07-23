import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import {HotKey} from "../utils";
import SelectionsProcessing from "../classes/SelectionsProcessing";

export const trimSelections: KeyshotsCommand = {
    category: Category.REPLACE_SELECTIONS,
    id: 'trim-selections',
    name: "Trim selections",
    hotkeys: {
        keyshots: [HotKey("T", "Alt")]
    },
    editorCallback: (editor) =>
        SelectionsProcessing.selectionsReplacer(
            editor,
            (s) => s.trim()
        )
}