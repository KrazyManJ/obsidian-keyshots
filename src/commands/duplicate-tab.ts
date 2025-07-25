import { View } from "obsidian";
import { Category } from "src/constants/Category";
import KeyshotsCommand from "src/model/KeyshotsCommand";
import KeyshotsPlugin from "src/plugin";
import { HotKey } from "src/utils";

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
        leaf.setViewState({
            type: view.getViewType(),
            state: view.getState(),
            active: true,
        })
        plugin.app.workspace.revealLeaf(leaf)
    }
})

export default duplicateTab