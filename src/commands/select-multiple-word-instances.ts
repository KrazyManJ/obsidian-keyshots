import KeyshotsPlugin from "../plugin";
import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import EditorSelectionManipulator from "../classes/EditorSelectionManipulator";
import {EditorRange, MarkdownView} from "obsidian";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import {getEditorValueWithoutFrontmatter, HotKey} from "../utils";

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
    editorCallback: (editor, view) => {
        const case_sensitive = plugin.settings.case_sensitive
        const selections: EditorSelectionManipulator[] = EditorSelectionManipulator.listSelections(editor)
        let rangeToScroll: EditorRange | undefined;

        let noteContent = editor.getValue()
        let frontmatterShift = 0;
        const isLivePreview = !(view as MarkdownView).getState().source
        
        if (isLivePreview) {
            const noteWithoutFrontmatter = getEditorValueWithoutFrontmatter(editor)
            frontmatterShift = noteContent.length - noteWithoutFrontmatter.length
            noteContent = noteWithoutFrontmatter
        }

        if (selections.filter(s => s.isCaret()).length > 0) {
            selections.filter(s => s.isCaret()).forEach((sel, i) => selections[i] = sel.selectWord())
        } else if (selections.filter(s => !s.isCaret()).length === selections.length && SelectionsProcessing.selectionValuesEqual(selections, case_sensitive)) {
            const sel = SelectionsProcessing.lowestSelection(selections).normalize()
            const tx = !case_sensitive ? sel.getText().toLowerCase() : sel.getText()

            const match = (!case_sensitive ? noteContent.toLowerCase() : noteContent).substring(sel.head.toOffset()-frontmatterShift).match(tx)
            if (match !== null) {
                const matchSel = EditorSelectionManipulator.documentStart(editor)
                    .setChars(sel.head.toOffset()-frontmatterShift)
                    .moveChars(frontmatterShift)
                    .moveChars(match.index ?? 0, (match.index ?? 0) + tx.length)
                selections.push(matchSel)
                rangeToScroll = matchSel.asEditorRange()
            } else {
                let editorSearchText = !case_sensitive ? noteContent.toLowerCase() : noteContent
                let shift = 0
                let match = editorSearchText.match(tx)
                while (match !== null) {
                    const prevTx = (!case_sensitive ? noteContent.toLowerCase() : noteContent).substring(0, shift + (match?.index || 0))
                    const sel = EditorSelectionManipulator.documentStart(editor)
                        .moveChars(frontmatterShift)
                        .moveChars(prevTx.length, prevTx.length + tx.length)
                    if (selections.filter(s => s.equals(sel)).length === 0) {
                        selections.push(sel)
                        rangeToScroll = sel.asEditorRange()
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
        if (rangeToScroll !== undefined) editor.scrollIntoView(rangeToScroll);
    }
})