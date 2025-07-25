import KeyshotsCommand from "../model/KeyshotsCommand";
import VerticalDirection from "../constants/VerticalDirection";
import {Editor} from "obsidian";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import {HotKey} from "../utils";
import {Category} from "../constants/Category";

export function vscodeDuplicate(editor: Editor, direction: VerticalDirection) {
    SelectionsProcessing.selectionsProcessorTransaction(editor, sel => {
        const finalSel = sel.clone()
        return {
            finalSelection: direction > 0 ? finalSel.moveLines(finalSel.linesCount) : finalSel,
            replaceSelection: sel.normalize().expand(),
            replaceText: sel.getText() + "\n" + sel.getText()
        }
    })
}

export const duplicateLineDown: KeyshotsCommand = {
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'duplicate-line-down',
    name: 'Duplicate line down (Visual Studio Code)',
    repeatable: true,
    hotkeys: {
        keyshots: [HotKey("ArrowDown", "Shift", "Alt")],
        vscode: [HotKey("ArrowDown", "Shift", "Alt")],
        jetbrains: null,
        visual_studio: null
    },
    editorCallback: (editor) => vscodeDuplicate(editor, VerticalDirection.DOWN)
}

export const duplicateLineUp: KeyshotsCommand = {
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'duplicate-line-up',
    name: 'Duplicate line up (Visual Studio Code)',
    repeatable: true,
    hotkeys: {
        keyshots: [HotKey("ArrowUp", "Shift", "Alt")],
        vscode: [HotKey("ArrowUp", "Shift", "Alt")],
        jetbrains: null,
        visual_studio: null
    },
    editorCallback: (editor) => vscodeDuplicate(editor, VerticalDirection.UP)
}
