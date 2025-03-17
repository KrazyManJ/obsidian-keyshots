import {Command, Notice} from "obsidian";
import * as functions from "./functions";
import {KeyshotsMap} from "./mappings/hotkeys"
import KeyshotsPlugin from "./plugin";
import IDEPresetModal from "./components/ide-preset-modal";
import DoubleKeyCommand from "./model/DoubleKeyCommand";
import {Category} from "./constants/Category";


interface KeyshotsCommand extends Command {
    category: Category
}

export const COMMANDS = (plugin: KeyshotsPlugin, map: KeyshotsMap): KeyshotsCommand[] => [
    
]

declare interface PluginConditionalObject<T> {
    conditional: (plugin: KeyshotsPlugin) => boolean,
    object: T
}


export const DOUBLE_KEY_COMMANDS = (plugin: KeyshotsPlugin): PluginConditionalObject<DoubleKeyCommand>[] => [
    {
        conditional: (plugin) => plugin.settings.carets_via_double_ctrl || plugin.settings.command_palette_via_double_ctrl,
        object: {
            id: "add-caret-and-open-command-palette",
            name: "Add caret cursors and open Command-Palette",
            key: "Control",
            maxDelay: 400,
            anotherKeyPressedCallback:
                plugin.settings.carets_via_double_ctrl
                ? (ev) => functions.addCaretsViaDoubleKey(plugin, ev)
                : undefined
            ,
            lastReleasedCallback:
                plugin.settings.command_palette_via_double_ctrl
                ? (interrupted) => {
                    if (!interrupted) functions.runCommandById(plugin, "command-palette:open",
                        () => new Notice("Command Pallete plugin is not enabled!")
                    )
                }
                : undefined
        }
    },
    {
        conditional: (plugin) => plugin.settings.quick_switch_via_double_shift,
        object: {
            id: "quick-open",
            name: "Open Quick-Switcher",
            key: "Shift",
            maxDelay: 400,
            lastReleasedCallback: (interrupted) => {
                if (!interrupted) {
                    if (plugin.settings.open_file_command === ""){
                        new Notice("You have no selected switch engine to use with double shift command!")
                        return
                    }
                    functions.runCommandById(plugin, plugin.settings.open_file_command,
                        () => new Notice("Selected switch engine is no longer available, please select another one in settings!")
                    )
                }
            }

        }
    }
]