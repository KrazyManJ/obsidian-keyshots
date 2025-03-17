import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import RegexReplaceModal from "../components/regex/regex-replace-modal";
import {HotKey} from "../utils";
import KeyshotsPlugin from "../plugin";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import EditorSelectionManipulator from "../classes/EditorSelectionManipulator";

export const replaceByRegex: (plugin: KeyshotsPlugin) => KeyshotsCommand = (plugin) =>({
    category: Category.REPLACE_SELECTIONS,
    id: 'replace-by-regex',
    name: "Replace by Regular Expression (Regex)",
    hotkeys: {
        keyshots: [HotKey("H", "Mod", "Alt")]
    },
    editorCallback: (editor) => new RegexReplaceModal(plugin, editor.getValue(), "Replace by Regular Expression",
        (data) => {
            if (data.only_selections)
                SelectionsProcessing.selectionsReplacer(editor, (val) =>
                    val.replace(data.pattern, data.replacer)
                )
            else
                editor.setValue(editor.getValue().replace(data.pattern, data.replacer))
            editor.focus()
        },
        (data) => {
            return (
                data.only_selections
                    ? EditorSelectionManipulator.listSelections(editor).map(s => s.getText())
                    : [editor.getValue()]
                )
                    .map(v => (v.match(data.pattern) || []).length)
                    .reduce((part, a) => part + a, 0)
        }
    ).open()
})