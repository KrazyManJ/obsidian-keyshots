import {Category} from "../constants/Category";
import VerticalDirection from "../constants/VerticalDirection";
import {Editor} from "obsidian";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import KeyshotsCommand from "../model/KeyshotsCommand";
import {HotKey} from "../utils";

function moveLine(editor: Editor, direction: VerticalDirection, border: number) {
    SelectionsProcessing.selectionsProcessorTransaction(editor, sel => {
        if (direction === 1 ? sel.asNormalized().head.line === border : sel.asNormalized().anchor.line === border) {
            return {
                finalSelection: sel
            }
        }
        const replaceSel = sel.asNormalized().moveLines(
            direction === VerticalDirection.UP ? direction : 0,
            direction === VerticalDirection.DOWN ? direction : 0
        ).expand()
        
        let replaceText = replaceSel.getText()
        if (sel.isCaret()) {
            replaceText = replaceText.split("\n").reverse().join("\n")
        }
        else {
            const lines = replaceText.split("\n")
            if (direction === VerticalDirection.DOWN) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                lines.unshift(lines.pop()!)
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                lines.push(lines.shift()!)
            }
            replaceText = lines.join("\n")
        }

        return {
            replaceSelection: replaceSel,
            replaceText: replaceText,
            finalSelection: sel.clone().moveLines(direction)
        }
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