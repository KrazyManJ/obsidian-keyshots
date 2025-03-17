import {Category} from "../constants/Category";
import TableModal from "../components/table-modal";
import KeyshotsCommand from "../model/KeyshotsCommand";
import KeyshotsPlugin from "../plugin";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import {HotKey} from "../utils";

export const insertTable: (plugin: KeyshotsPlugin) => KeyshotsCommand = (plugin) => ({
    category: Category.INSERT_COMPONENTS,
    id: 'insert-table',
    name: "Insert Table",
    hotkeys: {
        keyshots: [HotKey("T", "Shift", "Alt")]
    },
    editorCallback: (editor) => new TableModal(
        plugin,
        (data) => {
            const {rows, columns} = data
            SelectionsProcessing.selectionsProcessor(editor, undefined, (sel) =>
                sel.normalize()
                    .replaceText(
                        `\n|${"     |".repeat(columns)}\n|${" --- |".repeat(columns)}${("\n|" + "     |".repeat(columns)).repeat(rows)}\n`
                    )
                    .moveLines(1)
                    .moveChars(2)
            )
            editor.focus()
        }
    ).open()
})