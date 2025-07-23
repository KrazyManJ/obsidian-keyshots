import KeyshotsPlugin from "../../plugin";
import DoubleKeyCommand from "../../model/DoubleKeyCommand";
import {runCommandById} from "../../utils";
import { Notice } from "obsidian";

export const openCommandPaletteDK: (plugin: KeyshotsPlugin) => DoubleKeyCommand = plugin => ({
    id: "open-command-palette",
    name: "Open command-palette",
    key: plugin.settings.key_command_palette_via_double_key_cmd,
    whitelistedCommands: ["command-palette:open"],
    maxDelay: 400,
    lastReleasedCallback:
        plugin.settings.enable_command_palette_via_double_key_cmd
            ? (interrupted) => {
                if (!interrupted) runCommandById(plugin, "command-palette:open",
                    () => new Notice("Command Pallete plugin is not enabled!")
                )
            }
            : undefined
})