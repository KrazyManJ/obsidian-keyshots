import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import RegexSearchModal from "../components/regex/regex-search-modal";
import {HotKey} from "../utils";
import KeyshotsPlugin from "../plugin";
import EditorSelectionManipulator from "../classes/EditorSelectionManipulator";

export const searchByRegex: (plugin: KeyshotsPlugin) => KeyshotsCommand = (plugin) => ({
    category: Category.SELECTION_ADD_OR_REMOVE,
    id: 'search-by-regex',
    name: "Search by Regular Expression (Regex)",
    hotkeys: {
        keyshots: [HotKey("S", "Mod", "Alt")]
    },
    editorCallback: (editor) => new RegexSearchModal(plugin, editor.getValue(), "Search by Regular Expression",
        (data) => {
            const {only_selections, pattern} = data
            const selections: EditorSelectionManipulator[] = [];
            if (only_selections) {
                EditorSelectionManipulator.listSelections(editor).forEach(sel => {
                    Array.from(sel.getText().matchAll(pattern)).forEach(value => {
                        const i = value.index ?? 0;
                        selections.push(EditorSelectionManipulator.documentStart(editor)
                            .moveChars(sel.asNormalized().anchor.toOffset())
                            .moveChars(i, i + value[0].length)
                        )
                    })
                })
            } else {
                Array.from(editor.getValue().matchAll(pattern)).forEach(value => {
                    const i = value.index ?? 0;
                    selections.push(EditorSelectionManipulator.documentStart(editor).moveChars(i, i + value[0].length))
                })
            }
            editor.setSelections(selections.map(v => v.toEditorSelection()))
            editor.focus()
        },
        (data) => (data.only_selections ? EditorSelectionManipulator.listSelections(editor).map(s => s.getText()) : [editor.getValue()])
.map(v => (v.match(data.pattern) || []).length).reduce((part, a) => part + a, 0)
    ).open()
})