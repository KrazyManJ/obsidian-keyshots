import {Hotkey, Modifier} from "obsidian";
import KeyshotsPlugin from "./main";

const HotKey = (key: string, ...modifiers: Modifier[]): Hotkey[] => [{key: key, modifiers: modifiers}]

export declare interface KeyshotsMap {
    add_carets_down?: Hotkey[]
    add_carets_up?: Hotkey[]
    duplicate_line_down?: Hotkey[]
    duplicate_line_up?: Hotkey[]
    duplicate_selection_or_line?: Hotkey[]
    encode_or_decode_uri?: Hotkey[]
    expand_line_selections?: Hotkey[]
    insert_line_above?: Hotkey[]
    insert_line_below?: Hotkey[]
    join_selected_lines?: Hotkey[]
    move_line_down?: Hotkey[]
    move_line_up?: Hotkey[]
    open_keyshots_settings?: Hotkey[]
    select_all_word_instances?: Hotkey[]
    select_multiple_word_instances?: Hotkey[]
    shuffle_selected_lines?: Hotkey[]
    sort_selected_lines?: Hotkey[]
    split_selections_by_lines?: Hotkey[]
    split_selections_on_new_line?: Hotkey[]
    toggle_case?: Hotkey[];
    toggle_inline_title?: Hotkey[]
    toggle_keyshots_case_sensitivity?: Hotkey[]
    toggle_line_numbers?: Hotkey[]
    toggle_readable_length?: Hotkey[]
    transform_from_to_snakecase?: Hotkey[]
    transform_from_to_kebabcase?: Hotkey[]
    transform_selections_to_lowercase?: Hotkey[]
    transform_selections_to_titlecase?: Hotkey[]
    transform_selections_to_uppercase?: Hotkey[]
    trim_selections?: Hotkey[]
    multi_toggle_bold?: Hotkey[]
    multi_toggle_italic?: Hotkey[]
    multi_toggle_code?: Hotkey[]
    multi_toggle_highlight?: Hotkey[]
    multi_toggle_comment?: Hotkey[]
    multi_toggle_strikethrough?: Hotkey[]
    open_dev_tools?: Hotkey[]
    toggle_keybinding?: Hotkey[]
}

export const DEFAULT_MAP: KeyshotsMap = {
    add_carets_down: HotKey("ArrowDown", "Mod", "Alt"),
    add_carets_up: HotKey("ArrowUp", "Mod", "Alt"),
    encode_or_decode_uri: HotKey("U", "Mod", "Alt"),
    insert_line_below: HotKey("Enter", "Shift"),
    insert_line_above: HotKey("Enter", "Ctrl", "Shift"),
    join_selected_lines: HotKey("J", "Mod", "Shift"),
    sort_selected_lines: HotKey("S", "Mod", "Shift"),
    shuffle_selected_lines: HotKey("S", "Mod", "Shift", "Alt"),
    split_selections_by_lines: HotKey("L", "Mod", "Alt"),
    split_selections_on_new_line: HotKey("S", "Alt"),
    select_all_word_instances: HotKey("L", "Mod", "Shift"),
    select_multiple_word_instances: HotKey("D", "Mod"),
    trim_selections: HotKey("T", "Alt"),
    move_line_up: HotKey("ArrowUp", "Alt"),
    move_line_down: HotKey("ArrowDown", "Alt"),
    duplicate_line_up: HotKey("ArrowUp", "Shift", "Alt"),
    duplicate_line_down: HotKey("ArrowDown", "Shift", "Alt"),
    duplicate_selection_or_line: HotKey("D", "Mod", "Alt"),
    expand_line_selections: HotKey("E", "Alt"),
    toggle_case: HotKey("U", "Ctrl", "Shift"),
    toggle_readable_length: HotKey("R", "Mod", "Alt"),
    toggle_line_numbers: HotKey("N", "Mod", "Alt"),
    toggle_inline_title: HotKey("T", "Mod", "Alt"),
    toggle_keyshots_case_sensitivity: HotKey("I", "Mod", "Alt"),
    transform_selections_to_lowercase: HotKey("L", "Alt"),
    transform_selections_to_uppercase: HotKey("U", "Alt"),
    transform_selections_to_titlecase: HotKey("C", "Alt"),
    transform_from_to_snakecase: HotKey("-", "Shift", "Alt"),
    transform_from_to_kebabcase: HotKey("-", "Alt"),
    open_keyshots_settings: HotKey(",", "Mod", "Alt"),
    multi_toggle_bold: HotKey("B","Mod", "Shift"),
    multi_toggle_italic: HotKey("I","Mod", "Shift"),
    open_dev_tools: HotKey("F12")
}
export const KEYSHOTS_MAPS: { [key: string]: KeyshotsMap } = {
    "clear": {},
    "keyshots": DEFAULT_MAP,
    "vscode": {
        add_carets_down: HotKey("ArrowDown", "Mod", "Alt"),
        add_carets_up: HotKey("ArrowUp", "Mod", "Alt"),
        insert_line_below: HotKey("Enter", "Mod"),
        insert_line_above: HotKey("Enter", "Mod", "Shift"),
        join_selected_lines: HotKey("J", "Mod"),
        select_all_word_instances: HotKey("L", "Mod", "Shift"),
        select_multiple_word_instances: HotKey("D", "Mod"),
        move_line_up: HotKey("ArrowUp", "Alt"),
        move_line_down: HotKey("ArrowDown", "Alt"),
        duplicate_line_up: HotKey("ArrowUp", "Shift", "Alt"),
        duplicate_line_down: HotKey("ArrowDown", "Shift", "Alt"),
        duplicate_selection_or_line: undefined,
        expand_line_selections: HotKey("L", "Mod"),
        toggle_case: undefined,
    },
    "jetbrains": {
        insert_line_below: HotKey("Enter", "Shift"),
        insert_line_above: HotKey("Enter", "Mod", "Alt"),
        join_selected_lines: HotKey("J", "Mod", "Shift"),
        select_all_word_instances: HotKey("J", "Mod", "Shift", "Alt"),
        select_multiple_word_instances: HotKey("J", "Alt"),
        move_line_up: HotKey("ArrowUp", "Shift", "Alt"),
        move_line_down: HotKey("ArrowDown", "Shift", "Alt"),
        duplicate_line_down: undefined,
        duplicate_line_up: undefined,
        duplicate_selection_or_line: HotKey("D", "Mod"),
        expand_line_selections: HotKey("W", "Mod"),
        toggle_case: HotKey("U", "Mod", "Shift"),
    },
    "visual_studio": {
        add_carets_down: HotKey("ArrowDown", "Shift", "Alt"),
        add_carets_up: HotKey("ArrowUp", "Shift", "Alt"),
        insert_line_below: HotKey("Enter", "Shift"),
        insert_line_above: HotKey("Enter", "Mod"),
        select_all_word_instances: HotKey(";", "Shift", "Alt"),
        select_multiple_word_instances: HotKey(".", "Shift", "Alt"),
        move_line_up: HotKey("ArrowUp", "Alt"),
        move_line_down: HotKey("ArrowDown", "Alt"),
        duplicate_line_down: undefined,
        duplicate_line_up: undefined,
        duplicate_selection_or_line: HotKey("D", "Mod"),
        expand_line_selections: HotKey("=", "Shift", "Alt"),
        transform_selections_to_lowercase: HotKey("U", "Mod"),
        transform_selections_to_uppercase: HotKey("U", "Mod", "Shift"),
        toggle_case: undefined,
    },
}

export const mapBySettings = (plugin: KeyshotsPlugin): KeyshotsMap => {
    return ["clear", "keyshots"].contains(plugin.settings.ide_mappings)
        ? KEYSHOTS_MAPS[plugin.settings.ide_mappings]
        : {...(plugin.settings.keyshot_mappings ? DEFAULT_MAP : {}), ...KEYSHOTS_MAPS[plugin.settings.ide_mappings]}
}