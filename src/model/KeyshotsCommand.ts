import {Command, Hotkey} from "obsidian";
import {Preset} from "./Preset";
import {Category} from "./Category";

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
     * **Does not allow Preset.CLEAR as it have to stay clear :)**
     */
    hotkeys?: Partial<Record<Preset, Hotkey[]>>
        & Partial<Record<Preset.CLEAR,never>>
}