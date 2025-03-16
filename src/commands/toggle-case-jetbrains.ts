import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import {HotKey} from "../utils";

export const toggleCaseJetbrains: KeyshotsCommand = {
    category: Category.REPLACE_SELECTIONS,
    id: 'toggle-case-jetbrains',
    name: "Toggle case (JetBrains)",
    hotkeys: {
        keyshots: [HotKey("U", "Mod", "Shift")],
        vscode: undefined,
        jetbrains: [HotKey("U", "Mod", "Shift")],
        visual_studio: undefined
    },
    editorCallback: (editor) => SelectionsProcessing.selectionsReplacer(
        editor,
        (str) => str === str.toLowerCase() ? str.toUpperCase() : str.toLowerCase()
    )
}