import KeyshotsPlugin from "../../plugin";
import DoubleKeyCommand from "../../model/DoubleKeyCommand";
import {MarkdownView} from "obsidian";
import {runCommandById} from "../../utils";
import {addCaretDown, addCaretUp} from "../add-caret";

export const addCaretDK: (plugin: KeyshotsPlugin) => DoubleKeyCommand = plugin => ({
    id: "add-caret",
    name: "Add caret",
    key: "Alt",
    maxDelay: 400,
    whitelistedCommands: [
        'keyshots:'+addCaretUp.id,
        'keyshots:'+addCaretDown.id,
    ],
    anotherKeyPressedCallback:
        plugin.settings.carets_via_double_ctrl
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