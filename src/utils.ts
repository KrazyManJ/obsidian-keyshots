import {App, Editor, Hotkey, Modifier, VaultConfig} from "obsidian";
import KeyshotsPlugin from "./plugin";


export const HotKey = (key: string, ...mods: Modifier[]): Hotkey => ({key: key, modifiers: mods})

export const satisfies = <T, >() => <U extends T>(u: U) => u;

export function flipBooleanSetting(
    app: App,
    setting: { [k in keyof VaultConfig]: VaultConfig[k] extends boolean ? k : never }[keyof VaultConfig]
) {
    app.vault.setConfig(setting, !(app.vault.getConfig(setting) ?? false))
}

export function runCommandById(keyshotsPlugin: KeyshotsPlugin, id: string, notAvailableCallback: () => void) {
    if (Object.keys(keyshotsPlugin.app.commands.commands).contains(id)) keyshotsPlugin.app.commands.executeCommandById(id)
    else notAvailableCallback()
}

export function getEditorValueWithoutFrontmatter(editor: Editor) {
    const FRONTMATTER_CLOSING_LINES = '---'

    const lines = editor.getValue().split("\n")
    if (lines[0] === FRONTMATTER_CLOSING_LINES) {
        let start = 1;
        while (start < lines.length && lines[start] !== FRONTMATTER_CLOSING_LINES) {
            start++;
        }
        if (start !== lines.length) {
            start++;
            lines.splice(0, start)
        }
    }
    return lines.join("\n")
}

export function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
