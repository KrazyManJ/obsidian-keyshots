export declare interface KeyshotsSettings {
    ide_mappings: string
    keyshot_mappings: boolean
    case_sensitive: boolean
    shuffle_rounds_amount: number
    carets_via_double_ctrl: boolean
    quick_switch_via_double_shift: boolean
}

export const DEFAULT_SETTINGS: KeyshotsSettings = {
    ide_mappings: "clear",
    keyshot_mappings: true,
    case_sensitive: true,
    shuffle_rounds_amount: 10,
    carets_via_double_ctrl: false,
    quick_switch_via_double_shift: false
}