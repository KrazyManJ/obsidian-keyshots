import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import CalloutPickerModal from "../components/callout-picker-modal";
import KeyshotsPlugin from "../plugin";
import {HotKey} from "../utils";
import SelectionsProcessing from "../classes/SelectionsProcessing";

export const betterInsertCallout: (plugin: KeyshotsPlugin) => KeyshotsCommand = (plugin) => ({
    category: Category.INSERT_COMPONENTS,
    id: 'better-insert-callout',
    name: "Better insert callout",
    hotkeys: {
        keyshots: [HotKey("C", "Shift", "Alt")],
    },
    editorCallback: (editor) => new CalloutPickerModal(plugin,
        (calloutId) => {
            SelectionsProcessing.selectionsProcessor(editor, undefined, (sel) => {
                return sel.normalize()
                    .replaceText(`\n>[!${calloutId}]\n${sel.getText().split("\n").map(p => "> " + p).join("\n")}\n`)
                    .moveLines(2)
                    .expand()
                    .moveChars(2, 0)
            })
            editor.focus();
        }
    ).open()
})