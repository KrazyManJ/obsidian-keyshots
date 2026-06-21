import { View } from "obsidian";
import { Category } from "@/constants/Category";
import KeyshotsCommand from "@/model/KeyshotsCommand";
import KeyshotsPlugin from "@/plugin";
import { HotKey } from "@/utils";

const duplicateTab: (plugin: KeyshotsPlugin) => KeyshotsCommand = (plugin) => ({
    category: Category.OTHER,
    id: 'duplicate-tab',
    name: "Duplicate tab",
    hotkeys: {
        keyshots: [HotKey("D", "Ctrl", "Alt")]
    },
    checkCallback: (checking) => {
        const view = plugin.app.workspace.getActiveViewOfType(View)
        if (checking) {
            return !!view
        }
        if (!view) {
            return;
        }
        const leaf = plugin.app.workspace.getLeaf(true)
        void leaf.setViewState({
            type: view.getViewType(),
            state: view.getState(),
            active: true,
        })
        void plugin.app.workspace.revealLeaf(leaf)
    }
})

export default duplicateTab