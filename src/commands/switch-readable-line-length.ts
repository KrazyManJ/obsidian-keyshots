import {Category} from "../constants/Category";
import {flipBooleanSetting, HotKey} from "../utils";
import KeyshotsPlugin from "../plugin";
import KeyshotsCommand from "../model/KeyshotsCommand";

export const switchReadableLineLength: (plugin: KeyshotsPlugin) => KeyshotsCommand = (plugin) => ({
    category: Category.OBSIDIAN_SETTINGS,
    id: 'switch-readable-length-setting',
    name: "Switch 'readable line length' setting",
    hotkeys: {
        keyshots: [HotKey("R", "Mod", "Alt")]
    },
    callback: () => flipBooleanSetting(plugin.app, 'readableLineLength')
})