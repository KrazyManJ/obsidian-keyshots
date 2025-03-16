import KeyshotsPlugin from "../plugin";
import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import EditorSelectionManipulator from "../classes/EditorSelectionManipulator";
import {EditorRange} from "obsidian";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import {HotKey} from "../utils";

export const selectMultipleWordInstances: (plugin: KeyshotsPlugin) => KeyshotsCommand = (plugin) => ({
    category: Category.SELECTION_ADD_OR_REMOVE,
    id: 'select-multiple-word-instances',
    name: "Select multiple word instances",
    hotkeys: {
        keyshots: [HotKey("D", "Mod")],
        vscode: [HotKey("D", "Mod")],
        jetbrains: [HotKey("J", "Alt")],
        visual_studio: [HotKey(".", "Shift", "Alt")]
    },
    editorCallback: (editor) => {
        const case_sensitive = plugin.settings.case_sensitive
        const selections: EditorSelectionManipulator[] = EditorSelectionManipulator.listSelections(editor)
        let range: EditorRange | undefined;
        if (selections.filter(s => s.isCaret()).length > 0) {
            selections.filter(s => s.isCaret()).forEach((sel, i) => selections[i] = sel.selectWord())
        } else if (selections.filter(s => !s.isCaret()).length === selections.length && SelectionsProcessing.selectionValuesEqual(selections, case_sensitive)) {
            const sel = SelectionsProcessing.lowestSelection(selections).normalize()
            const tx = !case_sensitive ? sel.getText().toLowerCase() : sel.getText()

            const match = (!case_sensitive ? editor.getValue().toLowerCase() : editor.getValue()).substring(sel.head.toOffset()).match(tx)
            if (match !== null) {
                const matchSel = EditorSelectionManipulator.documentStart(editor).setChars(sel.head.toOffset())
                    .moveChars(match.index ?? 0, (match.index ?? 0) + tx.length)
                selections.push(matchSel)
                range = matchSel.asEditorRange()
            } else {
                let editorSearchText = !case_sensitive ? editor.getValue().toLowerCase() : editor.getValue()
                let shift = 0
                let match = editorSearchText.match(tx)
                while (match !== null) {
                    const prevTx = (!case_sensitive ? editor.getValue().toLowerCase() : editor.getValue()).substring(0, shift + (match?.index || 0))
                    const sel = EditorSelectionManipulator.documentStart(editor).moveChars(prevTx.length, prevTx.length + tx.length)
                    if (selections.filter(s => s.equals(sel)).length === 0) {
                        selections.push(sel)
                        range = sel.asEditorRange()
                        break;
                    } else {
                        shift += (match?.index || 0) + tx.length
                        editorSearchText = editorSearchText.substring((match?.index || 0) + tx.length)
                    }
                    match = editorSearchText.match(tx)
                }
            }
        } else return;
        editor.setSelections(selections);
        if (range !== undefined) editor.scrollIntoView(range);
    }
})