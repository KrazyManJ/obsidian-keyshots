import { KeyshotsCommandPluginCallback } from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import {HotKey} from "../utils";

export const toggleFocusMode: KeyshotsCommandPluginCallback = (plugin) => ({
    category: Category.OTHER,
    id: 'toggle-focus-mode',
    name: "Toggle focus mode",
    hotkeys: {
        keyshots: [HotKey("F", "Mod", "Alt")]
    },
    callback: () => {
        const isFocus = window.document.body.classList.contains("keyshots-focus-mode");
        electron.remote.BrowserWindow.getAllWindows().forEach(w => w.setFullScreen(!isFocus))
        Array.of("left", "right").forEach(side => {
            const sideBar = document.querySelector(`div.mod-${side}-split`)
            if (sideBar && !sideBar.classList.contains(`is-sidedock-collapsed`) && !isFocus)
                plugin.app.commands.executeCommandById(`app:toggle-${side}-sidebar`)
        })
        const cls = window.document.body.classList;
        if (isFocus)
            cls.remove("keyshots-focus-mode");
        else
            cls.add("keyshots-focus-mode");
    }
})