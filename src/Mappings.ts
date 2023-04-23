import {hotKey} from "./Utils";
import {Hotkey} from "obsidian";

declare interface KeyshotsMap {
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
}

export const DEFAULT_MAP: KeyshotsMap = {
    add_carets_down: hotKey("ArrowDown", "Mod", "Alt"),
    add_carets_up: hotKey("ArrowUp", "Mod", "Alt"),
    encode_or_decode_uri: hotKey("U", "Mod", "Alt"),
    insert_line_below: hotKey("Enter", "Shift"),
    insert_line_above: hotKey("Enter", "Ctrl", "Shift"),
    join_selected_lines: hotKey("J", "Mod", "Shift"),
    sort_selected_lines: hotKey("S", "Mod", "Shift"),
    shuffle_selected_lines: hotKey("S", "Mod", "Shift", "Alt"),
    split_selections_by_lines: hotKey("L", "Mod", "Alt"),
    split_selections_on_new_line: hotKey("S", "Alt"),
    select_all_word_instances: hotKey("L", "Mod", "Shift"),
    select_multiple_word_instances: hotKey("D", "Mod"),
    trim_selections: hotKey("T", "Alt"),
    move_line_up: hotKey("ArrowUp", "Alt"),
    move_line_down: hotKey("ArrowDown", "Alt"),
    duplicate_line_up: hotKey("ArrowUp", "Shift", "Alt"),
    duplicate_line_down: hotKey("ArrowDown", "Shift", "Alt"),
    duplicate_selection_or_line: hotKey("D", "Mod", "Alt"),
    expand_line_selections: hotKey("E", "Alt"),
    toggle_case: hotKey("U", "Ctrl", "Shift"),
    toggle_readable_length: hotKey("R", "Mod", "Alt"),
    toggle_line_numbers: hotKey("N", "Mod", "Alt"),
    toggle_inline_title: hotKey("T", "Mod", "Alt"),
    toggle_keyshots_case_sensitivity: hotKey("I", "Mod", "Alt"),
    transform_selections_to_lowercase: hotKey("L", "Alt"),
    transform_selections_to_uppercase: hotKey("U", "Alt"),
    transform_selections_to_titlecase: hotKey("C", "Alt"),
    transform_from_to_snakecase: hotKey("-", "Shift", "Alt"),
    transform_from_to_kebabcase: hotKey("-", "Alt"),
    open_keyshots_settings: hotKey(",", "Mod", "Alt")
}
export const KEYSHOTS_MAPS: { [key: string]: KeyshotsMap } = {
    "clear": {},
    "keyshots": DEFAULT_MAP,
    "vscode": {
        add_carets_down: hotKey("ArrowDown", "Mod", "Alt"),
        add_carets_up: hotKey("ArrowUp", "Mod", "Alt"),
        insert_line_below: hotKey("Enter", "Mod"),
        insert_line_above: hotKey("Enter", "Mod", "Shift"),
        join_selected_lines: hotKey("J", "Mod"),
        select_all_word_instances: hotKey("L", "Mod", "Shift"),
        select_multiple_word_instances: hotKey("D", "Mod"),
        move_line_up: hotKey("ArrowUp", "Alt"),
        move_line_down: hotKey("ArrowDown", "Alt"),
        duplicate_line_up: hotKey("ArrowUp", "Shift", "Alt"),
        duplicate_line_down: hotKey("ArrowDown", "Shift", "Alt"),
        duplicate_selection_or_line: undefined,
        expand_line_selections: hotKey("L", "Mod"),
        toggle_case: undefined,
    },
    "jetbrains": {
        insert_line_below: hotKey("Enter", "Shift"),
        insert_line_above: hotKey("Enter", "Mod", "Alt"),
        join_selected_lines: hotKey("J", "Mod", "Shift"),
        select_all_word_instances: hotKey("J", "Mod", "Shift", "Alt"),
        select_multiple_word_instances: hotKey("J", "Alt"),
        move_line_up: hotKey("ArrowUp", "Shift", "Alt"),
        move_line_down: hotKey("ArrowDown", "Shift", "Alt"),
        duplicate_line_down: undefined,
        duplicate_line_up: undefined,
        duplicate_selection_or_line: hotKey("D", "Mod"),
        expand_line_selections: hotKey("W", "Mod"),
        toggle_case: hotKey("U", "Mod", "Shift"),
    },
    "visual_studio": {
        add_carets_down: hotKey("ArrowDown", "Shift", "Alt"),
        add_carets_up: hotKey("ArrowUp", "Shift", "Alt"),
        insert_line_below: hotKey("Enter", "Shift"),
        insert_line_above: hotKey("Enter", "Mod"),
        select_all_word_instances: hotKey(";", "Shift", "Alt"),
        select_multiple_word_instances: hotKey(".", "Shift", "Alt"),
        move_line_up: hotKey("ArrowUp", "Alt"),
        move_line_down: hotKey("ArrowDown", "Alt"),
        duplicate_line_down: undefined,
        duplicate_line_up: undefined,
        duplicate_selection_or_line: hotKey("D", "Mod"),
        expand_line_selections: hotKey("=", "Shift", "Alt"),
        transform_selections_to_lowercase: hotKey("U", "Mod"),
        transform_selections_to_uppercase: hotKey("U", "Mod", "Shift"),
        toggle_case: undefined,

    },
}