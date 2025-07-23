import {Category} from "../constants/Category";
import IDEPresetModal from "../components/ide-preset-modal";
import KeyshotsPlugin from "../plugin";
import KeyshotsCommand from "../model/KeyshotsCommand";
import {HotKey} from "../utils";

export const changeKeyshotsPreset: (plugin: KeyshotsPlugin) => KeyshotsCommand = plugin => ({
    category: Category.KEYSHOTS_SETTINGS,
    id: 'change-keyshots-preset',
    name: "Change Keyshots preset",
    hotkeys: { keyshots: [HotKey("P", "Mod", "Shift")] },
    callback: () => new IDEPresetModal(plugin).open()
})