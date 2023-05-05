import {Command, Notice} from "obsidian";
import * as functions from "./functions";
import {KeyshotsMap} from "./mappings/hotkeys"
import KeyshotsPlugin from "./plugin";
import {DoubleKeyCommand} from "./classes/double-key-registry";
import IDEPresetModal from "./components/ide-preset-modal";
import CodeBlockModal from "./components/code-block-modal";
import {VerticalDirection} from "./classes/vertical-direction";


export const COMMANDS = (plugin: KeyshotsPlugin, map: KeyshotsMap): Command[] => [
    /*
    * =======================================================================================
    * OBSIDIAN SETTINGS
    * =======================================================================================
    */
    {
        id: 'toggle-readable-length',
        name: "Toggle readable line length (setting)",
        hotkeys: map.toggle_readable_length,
        callback: () => functions.flipBooleanSetting(plugin.app, 'readableLineLength')
    },
    {
        id: 'toggle-line-numbers',
        name: "Toggle line numbers (setting)",
        hotkeys: map.toggle_line_numbers,
        callback: () => functions.flipBooleanSetting(plugin.app, 'showLineNumber')
    },
    {
        id: 'toggle-inline-title',
        name: "Toggle inline title (setting)",
        hotkeys: map.toggle_inline_title,
        callback: () => functions.flipBooleanSetting(plugin.app, 'showInlineTitle')
    },
    /*
    * =======================================================================================
    * KEYSHOTS SETTINGS
    * =======================================================================================
    */
    {
        id: 'change-keyshots-preset',
        name: "Change Keyshots Preset",
        hotkeys: map.change_hotkeys_presets,
        callback: () => new IDEPresetModal(plugin).open()
    },
    {
        id: 'toggle-keyshots-case-sensitivity',
        name: "Toggle Keyshots case sensitivity",
        hotkeys: map.toggle_keyshots_case_sensitivity,
        callback: () => functions.toggleCaseSensitivity(plugin)
    },
    {
        id: 'open-keyshots-settings',
        name: "Open Keyshots settings",
        hotkeys: map.open_keyshots_settings,
        callback: () => functions.openKeyshotsSettings(app)
    },
    /*
    * =======================================================================================
    * EDITOR LINE ACTIONS
    * =======================================================================================
    */
    {
        id: 'move-line-up',
        name: 'Move line up',
        repeatable: true,
        hotkeys: map.move_line_up,
        editorCallback: (editor) => functions.moveLine(editor, VerticalDirection.UP, 0)
    },
    {
        id: 'move-line-down',
        name: 'Move line down',
        repeatable: true,
        hotkeys: map.move_line_down,
        editorCallback: (editor) => functions.moveLine(editor, VerticalDirection.DOWN, editor.lineCount() - 1)
    },
    {
        id: 'duplicate-line-up',
        name: 'Duplicate line up (Visual Studio Code)',
        repeatable: true,
        hotkeys: map.duplicate_line_up,
        editorCallback: (editor) => functions.vscodeDuplicate(editor, VerticalDirection.UP)
    },
    {
        id: 'duplicate-line-down',
        name: 'Duplicate line down (Visual Studio Code)',
        repeatable: true,
        hotkeys: map.duplicate_line_down,
        editorCallback: (editor) => functions.vscodeDuplicate(editor, VerticalDirection.DOWN)
    },
    {
        id: 'duplicate-selection-or-line',
        name: 'Duplicate selection or line (JetBrains IDEs)',
        repeatable: true,
        hotkeys: map.duplicate_selection_or_line,
        editorCallback: (editor) => functions.jetBrainsDuplicate(editor)
    },
    {
        id: 'insert-line-above',
        name: "Insert line above",
        repeatable: true,
        hotkeys: map.insert_line_above,
        editorCallback: (editor) => functions.insertLine(editor, VerticalDirection.UP)
    },
    {
        id: 'insert-line-below',
        name: "Insert line below",
        repeatable: true,
        hotkeys: map.insert_line_below,
        editorCallback: (editor) => functions.insertLine(editor, VerticalDirection.DOWN)
    },
    {
        id: 'join-selected-lines',
        name: "Join selected lines",
        hotkeys: map.join_selected_lines,
        editorCallback: (editor) => functions.replaceSelections(editor, (s) => s.replace(/\n/g, ""))
    },
    {
        id: 'split-selections-on-new-line',
        name: "Split selections on new line",
        hotkeys: map.split_selections_on_new_line,
        editorCallback: (editor) => functions.splitSelectedTextOnNewLine(editor)
    },
    {
        id: 'expand-line-selections',
        name: "Expand line selections",
        hotkeys: map.expand_line_selections,
        editorCallback: (editor) => functions.expandSelections(editor)
    },
    {
        id: 'sort-selected-lines',
        name: "Sort selected lines",
        hotkeys: map.sort_selected_lines,
        editorCallback: (editor) => functions.sortSelectedLines(editor)
    },
    {
        id: 'shuffle-selected-lines',
        name: "Shuffle selected lines",
        hotkeys: map.shuffle_selected_lines,
        editorCallback: (editor) => functions.shuffleSelectedLines(editor, plugin.settings.shuffle_rounds_amount)
    },
    /*
    * =======================================================================================
    * SELECTIONS ADDING/REMOVING
    * =======================================================================================
    */
    {
        id: 'add-carets-up',
        name: 'Add caret cursor up',
        repeatable: true,
        hotkeys: map.add_carets_up,
        editorCallback: (editor) => functions.addCarets(editor, VerticalDirection.UP, 0)
    },
    {
        id: 'add-carets-down',
        name: 'Add caret cursor down',
        repeatable: true,
        hotkeys: map.add_carets_down,
        editorCallback: (editor) => functions.addCarets(editor, VerticalDirection.DOWN, editor.lineCount())
    },
    {
        id: 'select-multiple-word-instances',
        name: "Select multiple word instances",
        hotkeys: map.select_multiple_word_instances,
        editorCallback: (editor) => functions.selectWordInstances(editor, plugin.settings.case_sensitive)
    },
    {
        id: 'select-all-word-instances',
        name: "Select all word instances",
        hotkeys: map.select_all_word_instances,
        editorCallback: (editor) => functions.selectAllWordInstances(editor, plugin.settings.case_sensitive)
    },
    {
        id: 'split-selections-by-lines',
        name: "Split selections by lines",
        hotkeys: map.split_selections_by_lines,
        editorCallback: (editor) => functions.splitSelectionsByLines(editor)
    },
    /*
    * =======================================================================================
    * TRANSFORM SELECTIONS
    * =======================================================================================
    */
    {
        id: 'trim-selections',
        name: "Trim selections",
        hotkeys: map.trim_selections,
        editorCallback: (editor) => functions.replaceSelections(editor, (s) => s.trim())
    },
    {
        id: 'transform-from-to-snake-case',
        name: "Transform selections from / to Snakecase",
        hotkeys: map.transform_from_to_snakecase,
        editorCallback: (editor) => functions.convertOneToOtherChars(editor, " ", "_")
    },
    {
        id: 'transform-from-to-kebab-case',
        name: "Transform selections from / to Kebabcase",
        hotkeys: map.transform_from_to_kebabcase,
        editorCallback: (editor) => functions.convertOneToOtherChars(editor, " ", "-")
    },
    {
        id: 'encode-or-decode-uri',
        name: "Encode / Decode URI selections",
        hotkeys: map.encode_or_decode_uri,
        editorCallback: (editor) => functions.convertURI(editor)
    },
    {
        id: 'transform-selections-to-lowercase',
        name: "Transform selections to Lowercase",
        hotkeys: map.transform_selections_to_lowercase,
        editorCallback: (editor) => functions.replaceSelections(editor, (s) => s.toLowerCase())
    },
    {
        id: 'transform-selections-to-uppercase',
        name: "Transform selections to Uppercase",
        hotkeys: map.transform_selections_to_uppercase,
        editorCallback: (editor) => functions.replaceSelections(editor, (s) => s.toUpperCase())
    },
    {
        id: 'transform-selections-to-titlecase',
        name: "Transform selections to Titlecase (Capitalize)",
        hotkeys: map.transform_selections_to_titlecase,
        editorCallback: (editor) => functions.replaceSelections(editor, (s) =>
            s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())
        )
    },
    {
        id: 'toggle-case',
        name: "Toggle case (JetBrains)",
        hotkeys: map.toggle_case,
        editorCallback: (editor) => functions.replaceSelections(editor, (str) => str === str.toLowerCase() ? str.toUpperCase() : str.toLowerCase())
    },
    /*
    * =======================================================================================
    * MULTI TOGGLERS/INSERTERS
    * =======================================================================================
    */
    {
        id: 'multi-toggle-bold',
        name: "Multi Toggle Bold",
        hotkeys: map.multi_toggle_bold,
        editorCallback: (editor) => functions.surroundWithChars(editor, "**")
    },
    {
        id: 'multi-toggle-italic',
        name: "Multi Toggle Italic",
        hotkeys: map.multi_toggle_italic,
        editorCallback: (editor) => functions.surroundWithChars(editor, "*")
    },
    {
        id: 'multi-toggle-code',
        name: "Multi Toggle Code",
        hotkeys: map.multi_toggle_code,
        editorCallback: (editor) => functions.surroundWithChars(editor, "``")
    },
    {
        id: 'multi-toggle-highlight',
        name: "Multi Toggle Highlight",
        hotkeys: map.multi_toggle_highlight,
        editorCallback: (editor) => functions.surroundWithChars(editor, "==")
    },
    {
        id: 'multi-toggle-comment',
        name: "Multi Toggle Comment",
        hotkeys: map.multi_toggle_comment,
        editorCallback: (editor) => functions.surroundWithChars(editor, "%%")
    },
    {
        id: 'multi-toggle-strikethrough',
        name: "Multi Toggle Strikethrough",
        hotkeys: map.multi_toggle_strikethrough,
        editorCallback: (editor) => functions.surroundWithChars(editor, "~~")
    },
    {
        id: 'toggle-underline',
        name: "Toggle Underline",
        hotkeys: map.toggle_underline,
        editorCallback: (editor) => functions.surroundWithChars(editor, "<u>", "</u>")
    },
    {
        id: 'toggle-keybinding',
        name: "Toggle Keybinding tag (<kbd>)",
        hotkeys: map.toggle_keybinding,
        editorCallback: (editor) => functions.surroundWithChars(editor, "<kbd>", "</kbd>")
    },
    {
        id: 'insert-code-block',
        name: "Insert Code Block",
        hotkeys: map.insert_codeblock,
        editorCallback: (editor) => new CodeBlockModal(
            plugin, (item) => functions.insertCodeBlock(editor, item)
        ).open()
    },
    /*
    * =======================================================================================
    * OTHERS
    * =======================================================================================
    */
    {
        id: 'open-dev-tools',
        name: "Open Developer Tools",
        hotkeys: map.open_dev_tools,
        callback: () => electron.remote.getCurrentWindow().webContents.openDevTools()
    }
]

declare interface PluginConditionalObject<T> {
    conditional: (plugin: KeyshotsPlugin) => boolean,
    object: T
}


export const DOUBLE_KEY_COMMANDS = (plugin: KeyshotsPlugin): PluginConditionalObject<DoubleKeyCommand>[] => [
    {
        conditional: (plugin) => plugin.settings.carets_via_double_ctrl,
        object: {
            id: "add-caret",
            name: "Add caret cursors",
            key: "Control",
            maxDelay: 1000,
            anotherKeyPressedCallback: (ev) => functions.addCaretsViaDoubleKey(plugin,ev)
        }
    },
    {
        conditional: (plugin) => plugin.settings.quick_switch_via_double_shift,
        object: {
            id: "quick-open",
            name: "Open Quick-Switcher",
            key: "Shift",
            maxDelay: 1000,
            lastPressedCallback: () => functions.runCommandById(plugin,"switcher:open",
                () => new Notice("Quick Switcher plugin is not enabled!")
            )
        }
    }
]