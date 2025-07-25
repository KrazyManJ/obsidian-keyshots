import {Command, Hotkey} from "obsidian";
import {ClearPreset, Preset} from "../constants/Presets";
import {Category} from "../constants/Category";
import KeyshotsPlugin from "src/plugin";

/**
 * The same implementation as {@link Command} with addition of hotkey selection based on preset and category
 */
export default interface KeyshotsCommand extends Omit<Command, "hotkeys"> {
    /**
     * Determines category of usage of command, mainly used in script to generate README table
     */
    category?: Category

    /**
     * Hotkeys in record structure to determine hotkeys for presets
     *
     * **Does not allow clear preset as it have to stay clear :)**
     *
     * If hotkey is {@link null}, it cannot be overriden with Keyshots preset if configured
     */
    hotkeys?: Partial<Record<Preset, Hotkey[] | null>> & Partial<Record<ClearPreset, never>>
}

/**
 * Used to register command that require instance of {@link KeyshotsPlugin}
 */
export type KeyshotsCommandPluginCallback = (plugin: KeyshotsPlugin) => KeyshotsCommand