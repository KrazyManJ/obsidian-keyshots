import {Category} from "../constants/Category";
import KeyshotsCommand from "../model/KeyshotsCommand";
import KeyshotsPlugin from "../plugin";
import {flipBooleanSetting, HotKey} from "../utils";

export const switchInlineTitleSetting: (plugin: KeyshotsPlugin) => KeyshotsCommand = (plugin) => ({
    category: Category.OBSIDIAN_SETTINGS,
    id: 'switch-inline-title-setting',
    name: "Switch 'inline title' setting",
    hotkeys: {
        keyshots: [HotKey("T", "Mod", "Alt")]
    },
    callback: () => flipBooleanSetting(plugin.app, 'showInlineTitle')
})