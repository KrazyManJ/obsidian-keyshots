import {Preset} from "../constants/Presets";

export default interface KeyshotsSettings {
    ide_mappings: Preset
    keyshot_mappings: boolean
    case_sensitive: boolean
    shuffle_rounds_amount: number
    carets_via_double_ctrl: boolean
    quick_switch_via_double_shift: boolean
    command_palette_via_double_ctrl: boolean
    callouts_list: string[]
    open_file_command: string
    modal_table_last_used_rows: number
    modal_table_last_used_columns: number
    modal_regex_last_used_pattern: string
    modal_regex_last_used_replacer: string
    modal_regex_last_used_case_sensitivity: boolean
    modal_regex_last_used_selections_only: boolean
    modal_regex_last_used_preview: boolean
}