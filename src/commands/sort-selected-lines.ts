import {Category} from "../constants/Category";
import KeyshotsCommand from "../model/KeyshotsCommand";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import {HotKey} from "../utils";

export const sortSelectedLines: KeyshotsCommand = {
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'sort-selected-lines',
    name: "Sort selected lines",
    hotkeys: {
        keyshots: [HotKey("S", "Mod", "Shift")]
    },
    editorCallback: (editor) => {
        SelectionsProcessing.selectionsProcessorTransaction(editor, sel => {
            return {
                replaceSelection: sel.expand(),
                replaceText: sel.getText()
                    .split("\n")
                    .sort((a: string, b: string) => a.localeCompare(b, undefined, {numeric: true, sensitivity: "base"}))
                    .join("\n")
            }
        }, arr => arr.filter(s => !s.isCaret()))
    }
}