import {Category} from "../constants/Category";
import VerticalDirection from "../constants/VerticalDirection";
import {Editor} from "obsidian";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import KeyshotsCommand from "../model/KeyshotsCommand";
import {HotKey} from "../utils";

function moveLine(editor: Editor, direction: VerticalDirection, border: number) {
    SelectionsProcessing.selectionsProcessor(editor, undefined, (sel) => {
        if (direction === 1 ? sel.asNormalized().head.line === border : sel.asNormalized().anchor.line === border) return sel
        const replaceSel = sel.asNormalized().moveLines(
            direction === -1 ? direction : 0,
            direction === 1 ? direction : 0
        ).expand()
        const tx = replaceSel.getText()
        if (sel.isCaret()) replaceSel.replaceText(tx.split("\n").reverse().join("\n"))
        else {
            const pieces = [
                tx.split("\n").slice(...(direction === 1 ? [-1] : [0, 1]))[0],
                tx.split("\n").slice(...(direction === 1 ? [undefined, -1] : [1])).join("\n")
            ]
            if (direction === -1) pieces.reverse()
            replaceSel.replaceText(pieces.join("\n"))
        }
        return sel.moveLines(direction)
    })
}

export const moveSelectedLinesDown: KeyshotsCommand = {
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'move-selected-lines-down',
    name: 'Move selected lines down',
    repeatable: true,
    hotkeys: {
        keyshots: [HotKey("ArrowDown", "Alt")],
        vscode: [HotKey("ArrowDown", "Alt")],
        jetbrains: [HotKey("ArrowDown", "Shift", "Alt")],
        visual_studio: [HotKey("ArrowDown", "Alt")],
    },
    editorCallback: (editor) => moveLine(editor, VerticalDirection.DOWN, editor.lineCount() - 1)
}
export const moveSelectedLinesUp : KeyshotsCommand = {
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'move-selected-lines-up',
    name: 'Move selected lines up',
    repeatable: true,
    hotkeys: {
        keyshots: [HotKey("ArrowUp", "Alt")],
        vscode: [HotKey("ArrowUp", "Alt")],
        jetbrains: [HotKey("ArrowUp", "Shift", "Alt")],
        visual_studio: [HotKey("ArrowUp", "Alt")],
    },
    editorCallback: (editor) => moveLine(editor, VerticalDirection.UP, 0)
}