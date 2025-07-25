import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import EditorSelectionManipulator from "../classes/EditorSelectionManipulator";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import KeyshotsPlugin from "../plugin";
import {getEditorValueWithoutFrontmatter, HotKey} from "../utils";
import { MarkdownView } from "obsidian";

export const selectAllWordInstances: (plugin: KeyshotsPlugin) => KeyshotsCommand = (plugin) => ({
    category: Category.SELECTION_ADD_OR_REMOVE,
    id: 'select-all-word-instances',
    name: "Select all word instances",
    hotkeys: {
        keyshots: [HotKey("L", "Mod", "Shift")],
        vscode: [HotKey("L", "Mod", "Shift")],
        jetbrains: [HotKey("J", "Mod", "Shift", "Alt")],
        visual_studio: [HotKey(";", "Shift", "Alt")],
    },
    editorCallback: (editor, view) => {
        const case_sensitive = plugin.settings.case_sensitive
        const selections: EditorSelectionManipulator[] = EditorSelectionManipulator.listSelections(editor)
        
        let noteContent = editor.getValue()
        let frontmatterShift = 0;
        const isLivePreview = !(view as MarkdownView).getState().source

        if (isLivePreview) {
            const noteWithoutFrontmatter = getEditorValueWithoutFrontmatter(editor)
            frontmatterShift = noteContent.length - noteWithoutFrontmatter.length
            noteContent = noteWithoutFrontmatter
        }

        selections.filter(s => s.isCaret()).forEach((sel, i) => selections[i] = sel.selectWord())
        if (selections.filter(s => !s.isCaret()).length === selections.length && SelectionsProcessing.selectionValuesEqual(selections, case_sensitive)) {
            const tx = selections[0].getText()
            Array.from(noteContent.matchAll(new RegExp(tx, "g" + (case_sensitive ? "" : "i"))), v => v.index || 0)
                .forEach(v => {
                    selections.push(
                        EditorSelectionManipulator.documentStart(editor)
                        .moveChars(frontmatterShift)
                        .moveChars(v, v + tx.length)
                    )
                })
        } else return;
        editor.setSelections(selections);
    }
})