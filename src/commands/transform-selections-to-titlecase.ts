import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import {HotKey} from "../utils";
import SelectionsProcessing from "../classes/SelectionsProcessing";

export const transformSelectionsToTitlecase: KeyshotsCommand = {
    category: Category.REPLACE_SELECTIONS,
    id: 'transform-selections-to-titlecase',
    name: "Transform selections to titlecase (capitalize)",
    hotkeys: {
        keyshots: [HotKey("C", "Alt")]
    },
    editorCallback: (editor) => SelectionsProcessing.selectionsReplacer(
        editor,
        (s) =>
            s.replace(
                /\w\S*/g,
                (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
        )
    )
}