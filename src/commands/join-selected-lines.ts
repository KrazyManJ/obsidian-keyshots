import {Category} from "../constants/Category";
import KeyshotsCommand from "../model/KeyshotsCommand";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import {HotKey} from "../utils";

export const joinSelectedLines: KeyshotsCommand = {
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'join-selected-lines',
    name: "Join selected lines",
    hotkeys: {
        keyshots: [HotKey("J", "Mod", "Shift")],
        vscode: [HotKey("J", "Mod")],
        jetbrains: [HotKey("J", "Mod", "Shift")]

    },
    editorCallback: (editor) => SelectionsProcessing.selectionsReplacer(
        editor,
        (s) => s.replace(/\n/g, " ")
    )
}