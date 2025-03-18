import KeyshotsPlugin from "../../plugin";
import DoubleKeyCommand from "../../model/DoubleKeyCommand";
import {MarkdownView, Notice} from "obsidian";
import {runCommandById} from "../../utils";
import {addCaretDown, addCaretUp} from "../add-caret";

export const addCaretAndOpenCommandPalette: (plugin: KeyshotsPlugin) => DoubleKeyCommand = plugin => ({
    id: "add-caret-and-open-command-palette",
    name: "Add caret cursors and open Command-Palette",
    key: "Control",
    maxDelay: 400,
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
    lastReleasedCallback:
        plugin.settings.command_palette_via_double_ctrl
            ? (interrupted) => {
                if (!interrupted) runCommandById(plugin, "command-palette:open",
                    () => new Notice("Command Pallete plugin is not enabled!")
                )
            }
            : undefined
})