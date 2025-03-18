import VerticalDirection from "../constants/VerticalDirection";
import {Category} from "../constants/Category";
import KeyshotsCommand from "../model/KeyshotsCommand";
import {Editor} from "obsidian";
import EditorSelectionManipulator from "../classes/EditorSelectionManipulator";
import {HotKey} from "../utils";


function addCarets(editor: Editor, direction: VerticalDirection, border: number) {
    const selections: EditorSelectionManipulator[] = EditorSelectionManipulator.listSelections(editor)
        .sort((a, b) => a.anchor.toOffset() - b.anchor.toOffset())
    if (selections.filter(s => !s.isCaret()).length > 0) return
    const main = selections.filter(s => s.anchor.line === editor.getCursor().line && s.anchor.ch === editor.getCursor().ch)[0]
    let mainIndex = selections.indexOf(main)
    const newSel = selections[direction > 0 ? selections.length - 1 : 0].clone()
    if (newSel.anchor.line === border) return
    newSel.moveLines(direction).setChars(Math.min(editor.getLine(newSel.anchor.line).length, main.anchor.ch))
    if (direction === VerticalDirection.DOWN && mainIndex !== 0) selections.shift()
    else if (direction === VerticalDirection.UP && mainIndex !== selections.length - 1) selections.pop()
    else if (direction === VerticalDirection.DOWN) selections.push(newSel)
    else {
        selections.unshift(newSel)
        mainIndex++;
    }
    selections.splice(mainIndex, 1)
    selections.unshift(main)
    editor.setSelections(selections)
    editor.scrollIntoView(newSel.anchor.clone().setPos(
        Math.min(editor.lineCount() - 1, newSel.anchor.line + direction * 2), newSel.anchor.ch
    ).asEditorRange())
}

export const addCaretDown: KeyshotsCommand = {
    category: Category.SELECTION_ADD_OR_REMOVE,
    id: 'add-caret-down',
    name: 'Add caret cursor down',
    repeatable: true,
    hotkeys: {
        keyshots: [HotKey("ArrowDown", "Mod", "Alt")],
        vscode: [HotKey("ArrowDown", "Mod", "Alt")],
        jetbrains: null,
        visual_studio: [HotKey("ArrowDown", "Shift", "Alt")]
    },
    editorCallback: (editor) => addCarets(editor, VerticalDirection.DOWN, editor.lineCount())
}

export const addCaretUp: KeyshotsCommand = {
    category: Category.SELECTION_ADD_OR_REMOVE,
    id: 'add-caret-up',
    name: 'Add caret cursor up',
    repeatable: true,
    hotkeys: {
        keyshots: [HotKey("ArrowUp", "Mod", "Alt")],
        vscode: [HotKey("ArrowUp", "Mod", "Alt")],
        jetbrains: null,
        visual_studio: [HotKey("ArrowUp", "Shift", "Alt")]
    },
    editorCallback: (editor) => addCarets(editor, VerticalDirection.UP, 0)
}