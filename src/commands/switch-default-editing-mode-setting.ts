import { MarkdownView } from "obsidian";
import {Category} from "../constants/Category";
import KeyshotsCommand from "../model/KeyshotsCommand";
import KeyshotsPlugin from "../plugin";
import {flipBooleanSetting, HotKey} from "../utils";

export const switchDefaultEditingModeSetting: (plugin: KeyshotsPlugin) => KeyshotsCommand = (plugin) => ({
    category: Category.OBSIDIAN_SETTINGS,
    id: 'switch-default-editing-mode-setting',
    name: "Switch 'Default editing mode' setting",
    hotkeys: {
        keyshots: [HotKey("E", "Mod", "Alt")]
    },
    callback: () => {
        flipBooleanSetting(plugin.app, 'livePreview')
        const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);

        if (!view) {
            return;
        }

        const isSetToLivePreview = plugin.app.vault.getConfig("livePreview")
        const isLivePreviewView = view.getState().source

        if (isSetToLivePreview === isLivePreviewView) {
            return;
        }

        view.setState(
            { mode: 'source', source: isSetToLivePreview },
            { history: false }
        )
    }
})