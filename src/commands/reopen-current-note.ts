import { KeyshotsCommandPluginCallback } from "../model/KeyshotsCommand";
import {Category} from "../constants/Category";
import {WorkspaceLeaf} from "obsidian";
import {HotKey} from "../utils";

export const reopenCurrentNote: KeyshotsCommandPluginCallback = (plugin) => ({
    category: Category.OTHER,
    id: 'reopen-current-note',
    name: "Reopen current note",
    hotkeys: {
        keyshots: [HotKey("Q", "Alt")]
    },
    checkCallback: (checking) => {
        const file = plugin.app.workspace.getActiveFile();
        if (file){
            if (!checking)
                // @ts-ignore
                (plugin.app.workspace.getLeaf(false) as WorkspaceLeaf & {rebuildView(): void}).rebuildView();
            else return true;
        }
        return false
    }
})