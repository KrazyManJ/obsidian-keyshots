import {Plugin} from 'obsidian';
import {DEFAULT_MAP, KEYSHOTS_MAPS} from "./mappings";
import {convertOneToOtherChars, flipBooleanSetting, replaceSelections, VerticalDirection} from "./utils";
import {
    addCarets,
    convertURI,
    expandSelections,
    insertLine,
    jetBrainsDuplicate,
    moveLine,
    openKeyshotsSettings,
    selectAllWordInstances,
    selectWordInstances,
    shuffleSelectedLines,
    sortSelectedLines,
    splitSelectedTextOnNewLine,
    splitSelectionsByLines,
    titleCase,
    toggleCaseSensitivity,
    vscodeDuplicate
} from "./commands";
import {DEFAULT_SETTINGS, KeyshotsSettings, KeyshotsSettingTab} from "./settings";


declare module 'obsidian' {
    interface VaultConfig {
        readableLineLength: boolean
        showLineNumber: boolean
        livePreview: boolean
        showInlineTitle: boolean
    }

    interface Vault {
        getConfig<T extends keyof VaultConfig>(config: T): VaultConfig[T];

        setConfig<T extends keyof VaultConfig>(config: T, value: VaultConfig[T]): void;
    }

    interface CommandManager {
        removeCommand(id: string): void;
    }

    interface SettingManager {
        activeTab: object

        open(): void

        openTabById(id: string): void
    }

    interface App {
        commands: CommandManager
        setting: SettingManager
    }
}


export default class KeyshotsPlugin extends Plugin {

    command_ids: Set<string>
    settings: KeyshotsSettings

    async onload() {
        await this.loadSettings()
        this.addSettingTab(new KeyshotsSettingTab(this.app, this))
        await this.loadCommands()
    }

    async loadCommands() {
        if (this.command_ids !== undefined) this.command_ids.forEach(cmd => this.app.commands.removeCommand(cmd))
        const IDS: string[] = []
        const MAP = ["clear", "keyshots"].contains(this.settings.ide_mappings)
            ? KEYSHOTS_MAPS[this.settings.ide_mappings]
            : {...(this.settings.keyshot_mappings ? DEFAULT_MAP : {}), ...KEYSHOTS_MAPS[this.settings.ide_mappings]}
        IDS.push(
            /*
            ========================================================================
                KEYSHOTS SETTINGS
            ========================================================================
            */
            this.addCommand({
                id: 'toggle-keyshots-case-sensitivity',
                name: "Toggle Keyshots case sensitivity",
                hotkeys: MAP.toggle_keyshots_case_sensitivity,
                callback: () => toggleCaseSensitivity(this)
            }).id,
            this.addCommand({
                id: 'open-keyshots-settings',
                name: "Open Keyshots settings",
                hotkeys: MAP.open_keyshots_settings,
                callback: () => openKeyshotsSettings(app)
            }).id,
            /*
            ========================================================================
                OBSIDIAN SETTINGS
            ========================================================================
            */
            this.addCommand({
                id: 'toggle-readable-length',
                name: "Toggle readable line length (setting)",
                hotkeys: MAP.toggle_readable_length,
                callback: () => flipBooleanSetting(this.app, 'readableLineLength')
            }).id,
            this.addCommand({
                id: 'toggle-line-numbers',
                name: "Toggle line numbers (setting)",
                hotkeys: MAP.toggle_line_numbers,
                callback: () => flipBooleanSetting(this.app, 'showLineNumber')
            }).id,
            this.addCommand({
                id: 'toggle-inline-title',
                name: "Toggle inline title (setting)",
                hotkeys: MAP.toggle_inline_title,
                callback: () => flipBooleanSetting(this.app, 'showInlineTitle')
            }).id,
            /*
            ========================================================================
                EDITOR MOVEMENT/ADD/REMOVE
            ========================================================================
            */
            this.addCommand({
                id: 'move-line-up',
                name: 'Move line up',
                hotkeys: MAP.move_line_up,
                editorCallback: (editor) => moveLine(editor, VerticalDirection.UP, 0)
            }).id,
            this.addCommand({
                id: 'move-line-down',
                name: 'Move line down',
                hotkeys: MAP.move_line_down,
                editorCallback: (editor) => moveLine(editor, VerticalDirection.DOWN, editor.lineCount() - 1)
            }).id,
            this.addCommand({
                id: 'add-carets-up',
                name: 'Add caret cursor up',
                hotkeys: MAP.add_carets_up,
                editorCallback: (editor) => addCarets(editor, VerticalDirection.UP, 0)
            }).id,
            this.addCommand({
                id: 'add-carets-down',
                name: 'Add caret cursor down',
                hotkeys: MAP.add_carets_down,
                editorCallback: (editor) => addCarets(editor, VerticalDirection.DOWN, editor.lineCount())
            }).id,
            this.addCommand({
                id: 'duplicate-line-up',
                name: 'Duplicate line up (Visual Studio Code)',
                hotkeys: MAP.duplicate_line_up,
                editorCallback: (editor) => vscodeDuplicate(editor, VerticalDirection.UP)
            }).id,
            this.addCommand({
                id: 'duplicate-line-down',
                name: 'Duplicate line down (Visual Studio Code)',
                hotkeys: MAP.duplicate_line_down,
                editorCallback: (editor) => vscodeDuplicate(editor, VerticalDirection.DOWN)
            }).id,
            this.addCommand({
                id: 'duplicate-selection-or-line',
                name: 'Duplicate selection or line (JetBrains IDEs)',
                hotkeys: MAP.duplicate_selection_or_line,
                editorCallback: (editor) => jetBrainsDuplicate(editor)
            }).id,
            this.addCommand({
                id: 'insert-line-above',
                name: "Insert line above",
                hotkeys: MAP.insert_line_above,
                editorCallback: (editor) => insertLine(editor, VerticalDirection.UP)
            }).id,
            this.addCommand({
                id: 'insert-line-below',
                name: "Insert line below",
                hotkeys: MAP.insert_line_below,
                editorCallback: (editor) => insertLine(editor, VerticalDirection.DOWN)
            }).id,
            this.addCommand({
                id: 'join-selected-lines',
                name: "Join selected lines",
                hotkeys: MAP.join_selected_lines,
                editorCallback: (editor) => replaceSelections(editor, (s) => s.replace(/\n/g, ""))
            }).id,
            this.addCommand({
                id: 'split-selections-on-new-line',
                name: "Split selections on new line",
                hotkeys: MAP.split_selections_on_new_line,
                editorCallback: (editor) => splitSelectedTextOnNewLine(editor)
            }).id,
            /*
            ========================================================================
                SELECTION CREATION
            ========================================================================
            */
            this.addCommand({
                id: 'select-multiple-word-instances',
                name: "Select multiple word instances",
                hotkeys: MAP.select_multiple_word_instances,
                editorCallback: (editor) => selectWordInstances(editor, this.settings.case_sensitive)
            }).id,
            this.addCommand({
                id: 'select-all-word-instances',
                name: "Select all word instances",
                hotkeys: MAP.select_all_word_instances,
                editorCallback: (editor) => selectAllWordInstances(editor, this.settings.case_sensitive)
            }).id,
            this.addCommand({
                id: 'expand-line-selections',
                name: "Expand line selections",
                hotkeys: MAP.expand_line_selections,
                editorCallback: (editor) => expandSelections(editor)
            }).id,
            this.addCommand({
                id: 'split-selections-by-lines',
                name: "Split selections by lines",
                hotkeys: MAP.split_selections_by_lines,
                editorCallback: (editor) => splitSelectionsByLines(editor)
            }).id,
            /*
            ========================================================================
                SELECTION TRANSFORMATIONS
            ========================================================================
            */
            this.addCommand({
                id: 'trim-selections',
                name: "Trim selections",
                hotkeys: MAP.trim_selections,
                editorCallback: (editor) => replaceSelections(editor, (s) => s.trim())
            }).id,
            this.addCommand({
                id: 'transform-from-to-snake-case',
                name: "Transform selections from / to Snakecase",
                hotkeys: MAP.transform_from_to_snakecase,
                editorCallback: (editor) => convertOneToOtherChars(editor, " ", "_")
            }).id,
            this.addCommand({
                id: 'transform-from-to-kebab-case',
                name: "Transform selections from / to Kebabcase",
                hotkeys: MAP.transform_from_to_kebabcase,
                editorCallback: (editor) => convertOneToOtherChars(editor, " ", "-")
            }).id,
            this.addCommand({
                id: 'encode-or-decode-uri',
                name: "Encode / Decode URI selections",
                hotkeys: MAP.encode_or_decode_uri,
                editorCallback: (editor) => convertURI(editor)
            }).id,
            this.addCommand({
                id: 'transform-selections-to-lowercase',
                name: "Transform selections to Lowercase",
                hotkeys: MAP.transform_selections_to_lowercase,
                editorCallback: (editor) => replaceSelections(editor, (s) => s.toLowerCase())
            }).id,
            this.addCommand({
                id: 'transform-selections-to-uppercase',
                name: "Transform selections to Uppercase",
                hotkeys: MAP.transform_selections_to_uppercase,
                editorCallback: (editor) => replaceSelections(editor, (s) => s.toUpperCase())
            }).id,
            this.addCommand({
                id: 'transform-selections-to-titlecase',
                name: "Transform selections to Titlecase (Capitalize)",
                hotkeys: MAP.transform_selections_to_titlecase,
                editorCallback: (editor) => replaceSelections(editor, (s) => titleCase(s))
            }).id,
            this.addCommand({
                id: 'toggle-case',
                name: "Toggle case (JetBrains)",
                hotkeys: MAP.toggle_case,
                editorCallback: (editor) => replaceSelections(editor, (str) => str === str.toLowerCase() ? str.toUpperCase() : str.toLowerCase())
            }).id,
            this.addCommand({
                id: 'sort-selected-lines',
                name: "Sort selected lines",
                hotkeys: MAP.sort_selected_lines,
                editorCallback: (editor) => sortSelectedLines(editor)
            }).id,
            this.addCommand({
                id: 'shuffle-selected-lines',
                name: "Shuffle selected lines",
                hotkeys: MAP.shuffle_selected_lines,
                editorCallback: (editor) => shuffleSelectedLines(editor, this.settings.shuffle_rounds_amount)
            }).id
        )
        this.command_ids = new Set(IDS);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

