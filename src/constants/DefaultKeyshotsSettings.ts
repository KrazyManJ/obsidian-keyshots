import KeyshotsSettings from "../model/KeyshotsSettings";

const DEFAULT_KEYSHOTS_SETTINGS: KeyshotsSettings = {
    ide_mappings: "clear",
    keyshot_mappings: true,
    case_sensitive: true,
    shuffle_rounds_amount: 10,
    carets_via_double_ctrl: false,
    quick_switch_via_double_shift: false,
    command_palette_via_double_ctrl: false,
    callouts_list: [],
    open_file_command: "",
    modal_table_last_used_rows: 2,
    modal_table_last_used_columns: 2,
    modal_regex_last_used_pattern: "",
    modal_regex_last_used_replacer: "",
    modal_regex_last_used_case_sensitivity: true,
    modal_regex_last_used_selections_only: false,
    modal_regex_last_used_preview: false,
}

export default DEFAULT_KEYSHOTS_SETTINGS