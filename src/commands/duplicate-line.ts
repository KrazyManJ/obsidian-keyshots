import KeyshotsCommand from "../model/KeyshotsCommand";
import VerticalDirection from "../constants/VerticalDirection";
import {Editor} from "obsidian";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import {HotKey} from "../utils";
import {Category} from "../constants/Category";

export function vscodeDuplicate(editor: Editor, direction: VerticalDirection) {
    SelectionsProcessing.selectionsProcessor(editor, undefined, (sel) => {
        if (sel.isCaret()) {
            const tx = sel.anchor.getLine()
            sel.anchor.setLine(tx + "\n" + tx)
            if (direction > 0) return sel.moveLines(1);
        } else {
            const replaceSel = sel.asNormalized().expand()
            const tx = replaceSel.getText()
            replaceSel.replaceText(tx + "\n" + tx)
            if (direction > 0) return sel.moveLines(sel.linesCount + 1)
        }
        return sel
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
