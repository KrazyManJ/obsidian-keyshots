import { View } from "obsidian";
import KeyshotsCommand from "src/model/KeyshotsCommand";
import { HotKey } from "src/utils";

const duplicateTab: KeyshotsCommand = {
    id: 'duplicate-tab',
    name: "Duplicate tab",
    hotkeys: {
        keyshots: [HotKey("D", "Ctrl", "Alt")]
    },
    checkCallback: (checking) => {
        const view = app.workspace.getActiveViewOfType(View)
        if (checking) {
            return !!view
        }
        if (!view) {
            return;
        }
        const leaf = app.workspace.getLeaf(true)
        leaf.setViewState({
            type: view.getViewType(),
            state: view.getState(),
            active: true,
        })
        app.workspace.revealLeaf(leaf)
        console.log(view)
    }
}

export default duplicateTab