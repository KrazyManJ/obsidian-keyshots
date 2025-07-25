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
            SelectionsProcessing.selectionsProcessorTransaction(editor, sel => {
                return {
                    replaceSelection: sel,
                    replaceText: `\n>[!${calloutId}]\n${sel.getText().split("\n").map(p => "> " + p).join("\n")}\n`,
                    finalSelection: sel.clone().expand().moveLines(2).moveCharsWithoutOffset(2)
                }
            })
            editor.focus();
        }
    ).open()
})