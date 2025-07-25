import KeyshotsPlugin from "src/plugin";
import {Category} from "../constants/Category";
import KeyshotsCommand from "../model/KeyshotsCommand";
import {HotKey} from "../utils";

export const openKeyshotsSettingsTab: (plugin: KeyshotsPlugin) => KeyshotsCommand = (plugin) => ({
    category: Category.KEYSHOTS_SETTINGS,
    id: 'open-keyshots-settings-tab',
    name: "Open Keyshots settings tab",
    hotkeys: { keyshots: [HotKey(",", "Mod", "Alt")] },
    callback: () => {
        if (plugin.app.setting.activeTab === null) plugin.app.setting.open()
        plugin.app.setting.openTabById("keyshots")
    }
})