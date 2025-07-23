import KeyshotsPlugin from "../../plugin";
import {Notice} from "obsidian";
import DoubleKeyCommand from "../../model/DoubleKeyCommand";
import {runCommandById} from "../../utils";

export const quickOpen: (plugin: KeyshotsPlugin) => DoubleKeyCommand = plugin => ({
    id: "quick-open",
    name: "Open Quick-Switcher",
    key: plugin.settings.key_quick_switch_via_double_key_cmd,
    maxDelay: 400,
    whitelistedCommands: [
        plugin.settings.open_file_command
    ],
    lastReleasedCallback: (interrupted) => {
        if (!interrupted) {
            if (plugin.settings.open_file_command === ""){
                new Notice("You have no selected switch engine to use with double shift command!")
                return
            }
            runCommandById(plugin, plugin.settings.open_file_command,
                () => new Notice("Selected switch engine is no longer available, please select another one in settings!")
            )
        }
    }
})