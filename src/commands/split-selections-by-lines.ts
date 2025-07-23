import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import {HotKey} from "../utils";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import EditorSelectionManipulator from "../classes/EditorSelectionManipulator";

export const splitSelectionsByLines: KeyshotsCommand = {
    category: Category.SELECTION_ADD_OR_REMOVE,
    id: 'split-selections-by-lines',
    name: "Split selections by lines",
    hotkeys: {
        keyshots: [HotKey("L", "Mod", "Alt")]
    },
    editorCallback: (editor) => {
        SelectionsProcessing.selectionsUpdater(editor, undefined, sel => {
            const selections: EditorSelectionManipulator[] = [];
            if (sel.isCaret() || sel.isOneLine()) selections.push(sel)
            else {
                sel.normalize()
                selections.push(sel.clone().setLines(sel.anchor.line).setChars(sel.anchor.ch, editor.getLine(sel.anchor.line).length))
                for (let i = sel.anchor.line + 1; i < sel.head.line; i++)
                    selections.push(sel.clone().setLines(i).setChars(0, editor.getLine(i).length))
                selections.push(sel.clone().setLines(sel.head.line).setChars(0, sel.head.ch))
            }
            return selections
        })
    }
}