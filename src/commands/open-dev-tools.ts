import KeyshotsCommand from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import {HotKey} from "../utils";

export const openDevTools: KeyshotsCommand = {
    category: Category.OTHER,
    id: 'open-dev-tools',
    name: "Open developer tools",
    hotkeys: {
        keyshots: [HotKey("F12")]
    },
    callback: () =>
        electron.remote.getCurrentWindow().webContents.openDevTools()
}