import {MarkdownView} from "obsidian";
import KeyshotsPlugin from "./plugin";


export function addCaretsViaDoubleKey(plugin: KeyshotsPlugin, ev: KeyboardEvent) {
    if (!["ArrowUp", "ArrowDown"].includes(ev.key)) return
    ev.preventDefault()
    const view = plugin.app.workspace.getActiveViewOfType(MarkdownView)
    if (!view) return;
    // addCarets(
    //     view.editor,
    //     ev.key === "ArrowUp" ? VerticalDirection.UP : VerticalDirection.DOWN,
    //     ev.key === "ArrowUp" ? 0 : view.editor.lineCount()
    // )
}

export function runCommandById(keyshotsPlugin: KeyshotsPlugin, id: string, notAvailableCallback: () => void) {
    if (Object.keys(keyshotsPlugin.app.commands.commands).contains(id)) keyshotsPlugin.app.commands.executeCommandById(id)
    else notAvailableCallback()
}