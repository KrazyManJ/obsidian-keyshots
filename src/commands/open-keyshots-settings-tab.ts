import {Category} from "../constants/Category";
import KeyshotsCommand from "../model/KeyshotsCommand";
import {HotKey} from "../utils";

export const openKeyshotsSettingsTab: KeyshotsCommand = {
    category: Category.KEYSHOTS_SETTINGS,
    id: 'open-keyshots-settings-tab',
    name: "Open Keyshots settings tab",
    hotkeys: { keyshots: [HotKey(",", "Mod", "Alt")] },
    callback: () => {
        if (app.setting.activeTab === null) app.setting.open()
        app.setting.openTabById("keyshots")
    }
}