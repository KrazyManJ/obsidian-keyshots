export declare interface KeyshotsSettings {
    ide_mappings: string
    keyshot_mappings: boolean
    case_sensitive: boolean
    shuffle_rounds_amount: number
    carets_via_double_ctrl: boolean
    quick_switch_via_double_shift: boolean
    modal_table_last_used_rows: number
    modal_table_last_used_columns: number
    modal_regex_last_used_pattern: string
    modal_regex_last_used_replacer: string
    modal_regex_last_used_case_sensitivity: boolean
    modal_regex_last_used_selections_only: boolean
    modal_regex_last_used_preview: boolean
}

export const DEFAULT_SETTINGS: KeyshotsSettings = {
    ide_mappings: "clear",
    keyshot_mappings: true,
    case_sensitive: true,
    shuffle_rounds_amount: 10,
    carets_via_double_ctrl: false,
    quick_switch_via_double_shift: false,
    modal_table_last_used_rows: 2,
    modal_table_last_used_columns: 2,
    modal_regex_last_used_pattern: "",
    modal_regex_last_used_replacer: "",
    modal_regex_last_used_case_sensitivity: true,
    modal_regex_last_used_selections_only: false,
    modal_regex_last_used_preview: false,
}