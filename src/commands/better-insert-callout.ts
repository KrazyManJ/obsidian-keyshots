import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import CalloutPickerModal from "../components/callout-picker-modal";
import KeyshotsPlugin from "../plugin";
import {HotKey} from "../utils";
import SelectionsProcessing from "../classes/SelectionsProcessing";
import EditorSelectionManipulator from "../classes/EditorSelectionManipulator";
import {createCalloutEdit, resolveCalloutCursorPosition} from "./better-insert-callout-edit";

export const betterInsertCallout: (plugin: KeyshotsPlugin) => KeyshotsCommand = (plugin) => ({
    category: Category.INSERT_COMPONENTS,
    id: 'better-insert-callout',
    name: "Better insert callout",
    hotkeys: {
        keyshots: [HotKey("C", "Shift", "Alt")],
    },
    editorCallback: (editor) => new CalloutPickerModal(
        plugin,
        (calloutId,evt) => {
            let foldingState: "" | "+" | "-" = "";

            if (evt.shiftKey) {
                foldingState = "+"
            }
            else if (evt.ctrlKey || evt.metaKey) {
                foldingState = "-"
            }

            SelectionsProcessing.selectionsProcessorTransaction(editor, sel => {
                const edit = createCalloutEdit(editor, sel, {
                    calloutId,
                    foldingState,
                    prependLineBreak: plugin.settings.callout_prepend_line_break,
                    cursorPosition: resolveCalloutCursorPosition(
                        sel,
                        plugin.settings.callout_cursor_position_with_selection,
                        plugin.settings.callout_cursor_position_without_selection
                    )
                })

                return {
                    replaceSelection: new EditorSelectionManipulator({anchor: edit.from, head: edit.to}, editor),
                    replaceText: edit.text,
                    finalSelection: new EditorSelectionManipulator({anchor: edit.cursor, head: edit.cursor}, editor)
                }
            })
            editor.focus();
        }
    ).open()
})
