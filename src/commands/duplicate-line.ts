import KeyshotsCommand from "../model/KeyshotsCommand";
import {VerticalDirection} from "../model/VerticalDirection";
import {Preset} from "../model/Preset";
import {Editor} from "obsidian";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import {HotKey} from "../utils";
import {Category} from "../model/Category";

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
        [Preset.KEYSHOTS]: [HotKey("ArrowDown", "Shift", "Alt")],
        [Preset.VSCODE]: [HotKey("ArrowDown", "Shift", "Alt")],
    },
    editorCallback: (editor) => vscodeDuplicate(editor, VerticalDirection.DOWN)
}

export const duplicateLineUp: KeyshotsCommand = {
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'duplicate-line-up',
    name: 'Duplicate line up (Visual Studio Code)',
    repeatable: true,
    hotkeys: {
        [Preset.KEYSHOTS]: [HotKey("ArrowUp", "Shift", "Alt")],
        [Preset.VSCODE]: [HotKey("ArrowUp", "Shift", "Alt")],
    },
    editorCallback: (editor) => vscodeDuplicate(editor, VerticalDirection.UP)
}
