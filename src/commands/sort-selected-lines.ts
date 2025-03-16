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
    editorCallback: (editor) => SelectionsProcessing.selectionsProcessor(editor, arr => arr.filter(s => !s.isCaret()), sel => {
        const replaceSel = sel.asNormalized().expand()
        replaceSel.replaceText(replaceSel.getText()
            .split("\n")
            .sort((a: string, b: string) => a.localeCompare(b, undefined, {numeric: true, sensitivity: "base"}))
            .join("\n")
        )
        return sel
    })
}