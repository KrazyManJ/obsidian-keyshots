import {Category} from "../constants/Category";
import KeyshotsPlugin from "../plugin";
import KeyshotsCommand from "../model/KeyshotsCommand";
import {HotKey} from "../utils";
import {Notice} from "obsidian";

export const switchKeyshotsCaseSensitivity: (plugin: KeyshotsPlugin) => KeyshotsCommand = plugin => ({
    category: Category.KEYSHOTS_SETTINGS,
    id: 'switch-keyshots-case-sensitivity',
    name: "Switch Keyshots case sensitivity",
    hotkeys: { keyshots: [HotKey("I", "Mod", "Alt")] },
    callback: async () =>  {
        plugin.settings.case_sensitive = !plugin.settings.case_sensitive
        const val = plugin.settings.case_sensitive
        new Notice(`${val ? "🔒" : "🔓"} Keyshots actions are now case ${val ? "" : "in"}sensitive!`)
        await plugin.saveSettings()
    }
})