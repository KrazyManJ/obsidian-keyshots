import {Category} from "../constants/Category";
import VerticalDirection from "../constants/VerticalDirection";
import KeyshotsCommand from "../model/KeyshotsCommand";
import {HotKey} from "../utils";
import {Editor} from "obsidian";
import SelectionsProcessing from "../classes/SelectionsProcessing";

export function insertLine(editor: Editor, direction: VerticalDirection) {
    SelectionsProcessing.selectionsProcessorTransaction(
        editor, 
        sel => {
            const expandedSelection = sel.clone().expand()
            let replaceText = expandedSelection.getText()
            
            if (direction > 0) {
                replaceText = replaceText + "\n"
            }
            else {
                replaceText = "\n" + replaceText
            }

            return {
                replaceSelection: expandedSelection,
                replaceText: replaceText,
                finalSelection: sel.collapse().setChars(0).moveLines(direction > 0 ? expandedSelection.linesCount : 0)
            }
        },
        array => array.sort((a, b) => a.anchor.line - b.anchor.line)
    )
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