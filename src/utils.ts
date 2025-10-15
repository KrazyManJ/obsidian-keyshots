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


export function joinLinesMarkdownAware(text: string): string {
    const bulletMarkers = ['-', '+', '*'];
    const stripNumbered = true;
    const stripCheckbox = true;
    const stripQuote = true;

    const lines = text.split("\n");
    if (lines.length === 0) return "";
    const firstLine = (lines[0] ?? "").trimEnd();

    const bulletClass = `[${bulletMarkers.map(escapeRegExp).join("")}]`;

    const rest = lines.slice(1).map((line) => {
        let s = (line ?? "").trim();
        if (stripQuote) s = s.replace(/^(?:>\s*)+/, "");
        if (stripCheckbox && bulletClass) s = s.replace(new RegExp(`^${bulletClass}[\t ]*\\[[xX ]\\][\t ]+`), "");
        if (bulletClass) s = s.replace(new RegExp(`^${bulletClass}[\t ]+`), "");
        if (stripNumbered) s = s.replace(/^\d+\.[\t ]+/, "");
        return s.trim();
    });

    let joinedLines = rest.filter((s) => s.length > 0);
    return [firstLine, ...joinedLines].join(" ");
}
