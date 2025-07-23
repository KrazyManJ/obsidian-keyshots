import {Category} from "../constants/Category";
import {flipBooleanSetting, HotKey} from "../utils";
import KeyshotsPlugin from "../plugin";
import KeyshotsCommand from "../model/KeyshotsCommand";

export const switchLineNumbersSetting : (plugin: KeyshotsPlugin) => KeyshotsCommand = (plugin) => ({
    category: Category.OBSIDIAN_SETTINGS,
    id: 'switch-line-numbers-setting',
    name: "Switch 'line numbers' setting",
    hotkeys: {
        keyshots: [HotKey("N", "Mod", "Alt")]
    },
    callback: () => flipBooleanSetting(plugin.app, 'showLineNumber')
})