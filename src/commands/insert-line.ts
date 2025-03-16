import {Category} from "../constants/Category";
import {VerticalDirection} from "../constants/VerticalDirection";
import KeyshotsCommand from "../model/KeyshotsCommand";
import {HotKey} from "../utils";
import {Editor} from "obsidian";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import EditorSelectionManipulator from "../classes/EditorSelectionManipulator";

export function insertLine(editor: Editor, direction: VerticalDirection) {
    SelectionsProcessing.selectionsProcessor(editor, (s) => s.sort((a, b) => a.anchor.line - b.anchor.line), (sel, index) => {
        const a = (ln: number) => {
            const tx = [editor.getLine(ln), "\n"]
            if (direction < 0) tx.reverse()
            editor.setLine(ln, tx.join(""))
            return EditorSelectionManipulator.documentStart(editor).setLines(ln + (direction > 0 ? direction : 0))
        }
        if (sel.isCaret()) return a(sel.anchor.line + index)
        else {
            const normSel = sel.asNormalized()
            return a((direction > 0 ? normSel.anchor.line : normSel.head.line) + index)
        }
    })
}

export const insertLineAbove: KeyshotsCommand = {
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'insert-line-above',
    name: "Insert line above",
    repeatable: true,
    hotkeys: {
        keyshots: [HotKey("Enter", "Mod", "Shift")],
        vscode: [HotKey("Enter", "Mod", "Shift")],
        jetbrains: [HotKey("Enter", "Mod", "Alt")],
        visual_studio: [HotKey("Enter", "Mod")],
    },
    editorCallback: (editor) => insertLine(editor, VerticalDirection.UP)
}

export const insertLineBelow: KeyshotsCommand = {
    category: Category.EDITOR_LINES_MANIPULATION,
    id: 'insert-line-below',
    name: "Insert line below",
    repeatable: true,
    hotkeys: {
        keyshots: [HotKey("Enter", "Shift")],
        vscode: [HotKey("Enter", "Mod")],
        jetbrains: [HotKey("Enter", "Shift")],
        visual_studio: [HotKey("Enter", "Shift")],
    },
    editorCallback: (editor) => insertLine(editor, VerticalDirection.DOWN)
}