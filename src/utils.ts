import {App, Hotkey, Modifier, VaultConfig} from "obsidian";
import KeyshotsPlugin from "./plugin";


export const HotKey = (key: string, ...mods: Modifier[]): Hotkey => ({key: key, modifiers: mods})

export const satisfies = <T,>() => <U extends T>(u: U) => u;

export function flipBooleanSetting(
    app: App,
    setting: { [k in keyof VaultConfig]: VaultConfig[k] extends boolean ? k : never }[keyof VaultConfig]
) {
    app.vault.setConfig(setting, !app.vault.getConfig(setting))
}

export function runCommandById(keyshotsPlugin: KeyshotsPlugin, id: string, notAvailableCallback: () => void) {
    if (Object.keys(keyshotsPlugin.app.commands.commands).contains(id)) keyshotsPlugin.app.commands.executeCommandById(id)
    else notAvailableCallback()
}