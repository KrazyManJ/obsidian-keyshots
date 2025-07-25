import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import {HotKey} from "../utils";

export const expandLineSelection: KeyshotsCommand = {
    category: Category.TRANSFORM_SELECTIONS,
    id: 'expand-line-selections',
    name: "Expand line selections",
    hotkeys: {
        keyshots: [HotKey("E", "Alt")],
        vscode: [HotKey("L", "Mod")],
        jetbrains: [HotKey("W", "Mod")],
        visual_studio: [HotKey("=", "Shift", "Alt")]
    },
    editorCallback: (editor) => SelectionsProcessing.selectionsProcessorTransaction(editor, sel => ({
        finalSelection: sel.expand(true)
    }))
}