import {Hotkey, Modifier} from "obsidian";

const HotKey = (key: string, ...modifiers: Modifier[]): Hotkey[] => [{key: key, modifiers: modifiers}]

export declare interface KeyshotsMap {
    // add_caret_down?: Hotkey[]
    // add_caret_up?: Hotkey[]
    // better_insert_callout?: Hotkey[]
    // change_keyshots_preset?: Hotkey[]
    // close_all_foldable_callouts?: Hotkey[]
    // duplicate_line_down?: Hotkey[]
    // duplicate_line_up?: Hotkey[]
    // duplicate_selection_or_line?: Hotkey[]
    // expand_line_selections?: Hotkey[]
    // go_to_next_fold?: Hotkey[]
    // go_to_previous_fold?: Hotkey[]
    // go_to_parent_fold?: Hotkey[]
    // insert_code_block?: Hotkey[]
    // insert_line_above?: Hotkey[]
    // insert_line_below?: Hotkey[]
    // insert_ordinal_numbering?: Hotkey[]
    // insert_table?: Hotkey[]
    // join_selected_lines?: Hotkey[]
    // move_line_down?: Hotkey[]
    // move_line_up?: Hotkey[]
    // open_all_foldable_callouts?: Hotkey[]
    // open_dev_tools?: Hotkey[]
    // open_keyshots_settings_tab?: Hotkey[]
    // reopen_current_note?: Hotkey[]
    // replace_by_regex?: Hotkey[]
    // reverse_selected_lines?: Hotkey[]
    // search_by_regex?: Hotkey[]
    // select_all_word_instances?: Hotkey[]
    // select_multiple_word_instances?: Hotkey[]
    // shuffle_selected_lines?: Hotkey[]
    // sort_selected_lines?: Hotkey[]
    // split_selections_by_lines?: Hotkey[]
    // split_selections_on_new_line?: Hotkey[]
    // switch_inline_title_setting?: Hotkey[]
    // switch_keyshots_case_sensitivity?: Hotkey[]
    // switch_line_numbers_setting?: Hotkey[]
    // switch_readable_length_setting?: Hotkey[]
    // toggle_all_callouts_fold_state?: Hotkey[]
    // toggle_case_jetbrains?: Hotkey[]
    // toggle_focus_mode?: Hotkey[]
    // toggle_kebabcase?: Hotkey[]
    // toggle_keyboard_input?: Hotkey[]
    // toggle_snakecase?: Hotkey[]
    // toggle_underline?: Hotkey[]
    // toggle_uri_encoded_or_decoded?: Hotkey[]
    // transform_selections_to_lowercase?: Hotkey[]
    // transform_selections_to_titlecase?: Hotkey[]
    // transform_selections_to_uppercase?: Hotkey[]
    // trim_selections?: Hotkey[]
}

export const DEFAULT_MAP: KeyshotsMap = {
    // add_caret_down: HotKey("ArrowDown", "Mod", "Alt"),
    // add_caret_up: HotKey("ArrowUp", "Mod", "Alt"),
    // better_insert_callout: HotKey("C", "Shift", "Alt"),
    // change_keyshots_preset: HotKey("P", "Mod", "Shift"),
    // close_all_foldable_callouts: HotKey("L", "Shift", "Alt"),
    // duplicate_line_down: HotKey("ArrowDown", "Shift", "Alt"),
    // duplicate_line_up: HotKey("ArrowUp", "Shift", "Alt"),
    // duplicate_selection_or_line: HotKey("D", "Mod", "Alt"),
    // expand_line_selections: HotKey("E", "Alt"),
    // go_to_next_fold: HotKey("]", "Mod", "Alt"),
    // go_to_previous_fold: HotKey("[", "Mod", "Alt"),
    // go_to_parent_fold: HotKey("P", "Mod", "Alt"),
    // insert_table: HotKey("T", "Shift", "Alt"),
    // insert_code_block: HotKey("`", "Mod", "Shift"),
    // insert_line_above: HotKey("Enter", "Mod", "Shift"),
    // insert_line_below: HotKey("Enter", "Shift"),
    // insert_ordinal_numbering: HotKey("N", "Shift", "Alt"),
    // join_selected_lines: HotKey("J", "Mod", "Shift"),
    // move_line_down: HotKey("ArrowDown", "Alt"),
    // move_line_up: HotKey("ArrowUp", "Alt"),
    // open_all_foldable_callouts: HotKey("O", "Shift", "Alt"),
    // open_dev_tools: HotKey("F12"),
    // open_keyshots_settings_tab: HotKey(",", "Mod", "Alt"),
    // reopen_current_note: HotKey("Q", "Alt"),
    // replace_by_regex: HotKey("H", "Mod", "Alt"),
    // reverse_selected_lines: HotKey("R", "Alt"),
    // search_by_regex: HotKey("S", "Mod", "Alt"),
    // select_all_word_instances: HotKey("L", "Mod", "Shift"),
    // select_multiple_word_instances: HotKey("D", "Mod"),
    // shuffle_selected_lines: HotKey("S", "Mod", "Shift", "Alt"),
    // sort_selected_lines: HotKey("S", "Mod", "Shift"),
    // split_selections_by_lines: HotKey("L", "Mod", "Alt"),
    // split_selections_on_new_line: HotKey("S", "Alt"),
    // switch_inline_title_setting: HotKey("T", "Mod", "Alt"),
    // switch_keyshots_case_sensitivity: HotKey("I", "Mod", "Alt"),
    // switch_line_numbers_setting: HotKey("N", "Mod", "Alt"),
    // switch_readable_length_setting: HotKey("R", "Mod", "Alt"),
    // toggle_all_callouts_fold_state: HotKey("K", "Shift", "Alt"),
    // toggle_case_jetbrains: HotKey("U", "Mod", "Shift"),
    // toggle_focus_mode: HotKey("F", "Mod", "Alt"),
    // toggle_kebabcase: HotKey("-", "Alt"),
    // toggle_keyboard_input: HotKey("K", "Mod", "Shift"),
    // toggle_snakecase: HotKey("-", "Shift", "Alt"),
    // toggle_underline: HotKey("N", "Alt"),
    // toggle_uri_encoded_or_decoded: HotKey("U", "Mod", "Alt"),
    // transform_selections_to_lowercase: HotKey("L", "Alt"),
    // transform_selections_to_titlecase: HotKey("C", "Alt"),
    // transform_selections_to_uppercase: HotKey("U", "Alt"),
    // trim_selections: HotKey("T", "Alt"),
}
