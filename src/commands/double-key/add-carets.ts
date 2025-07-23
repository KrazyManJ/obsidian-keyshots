import KeyshotsPlugin from "../../plugin";
import DoubleKeyCommand from "../../model/DoubleKeyCommand";
import {MarkdownView} from "obsidian";
import {runCommandById} from "../../utils";
import {addCaretDown, addCaretUp} from "../add-caret";

export const addCaretDK: (plugin: KeyshotsPlugin) => DoubleKeyCommand = plugin => ({
    id: "add-carets",
    name: "Add carets",
    key: plugin.settings.key_carets_via_double_key_cmd,
    maxDelay: 400,
    whitelistedCommands: [
        'keyshots:'+addCaretUp.id,
        'keyshots:'+addCaretDown.id,
    ],
    anotherKeyPressedCallback:
        plugin.settings.enable_carets_via_double_key_cmd
            ? (ev) => {
                if (!["ArrowUp", "ArrowDown"].includes(ev.key)) return
                ev.preventDefault()
                const view = plugin.app.workspace.getActiveViewOfType(MarkdownView)
                if (!view) return;
                runCommandById(plugin,"keyshots:"+(ev.key === "ArrowUp" ? addCaretUp.id : addCaretDown.id),()=>{})
            }
            : undefined
    ,
})