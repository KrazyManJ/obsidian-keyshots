import {Command, Notice} from "obsidian";
import * as functions from "./functions";
import {KeyshotsMap} from "./mappings/hotkeys"
import KeyshotsPlugin from "./plugin";
import {DoubleKeyCommand} from "./classes/double-key-registry";
import IDEPresetModal from "./components/ide-preset-modal";
import CodeBlockModal from "./components/code-block-modal";
import {VerticalDirection} from "./classes/vertical-direction";
import CalloutPickerModal from "./components/callout-picker-modal";
import TableModal from "./components/table-modal";
import RegexReplaceModal from "./components/regex/regex-replace-modal";
import RegexSearchModal from "./components/regex/regex-search-modal";


enum Category {
    OBSIDIAN_SETTINGS = "Obsidian Settings",
    KEYSHOTS_SETTINGS = "Keyshots Settings",
    EDITOR_LINES_MANIPULATION = "Editor Lines Manipulation",
    SELECTION_ADD_OR_REMOVE = "Selection Adding or Removing",
    REPLACE_SELECTIONS = "Replace Selections",
    TRANSFORM_SELECTIONS = "Transform Selections",
    INSERT_COMPONENTS = "Insert Components",
    RENDERED_CONTROLING = "Rendered Controling",
    OTHER = "Other"
}

interface KeyshotsCommand extends Command {
    category: Category
}

export const COMMANDS = (plugin: KeyshotsPlugin, map: KeyshotsMap): KeyshotsCommand[] => [
    {
        category: Category.EDITOR_LINES_MANIPULATION,
        id: 'duplicate-line-down',
        name: 'Duplicate line down (Visual Studio Code)',
        repeatable: true,
        hotkeys: map.duplicate_line_down,
        editorCallback: (editor) => functions.vscodeDuplicate(editor, VerticalDirection.DOWN)
    },
    {
        category: Category.EDITOR_LINES_MANIPULATION,
        id: 'duplicate-line-up',
        name: 'Duplicate line up (Visual Studio Code)',
        repeatable: true,
        hotkeys: map.duplicate_line_up,
        editorCallback: (editor) => functions.vscodeDuplicate(editor, VerticalDirection.UP)
    },
    {
        category: Category.EDITOR_LINES_MANIPULATION,
        id: 'duplicate-selection-or-line',
        name: 'Duplicate selection or line (JetBrains IDEs)',
        repeatable: true,
        hotkeys: map.duplicate_selection_or_line,
        editorCallback: (editor) => functions.jetBrainsDuplicate(editor)
    },
    {
        category: Category.EDITOR_LINES_MANIPULATION,
        id: 'insert-line-above',
        name: "Insert line above",
        repeatable: true,
        hotkeys: map.insert_line_above,
        editorCallback: (editor) => functions.insertLine(editor, VerticalDirection.UP)
    },
    {
        category: Category.EDITOR_LINES_MANIPULATION,
        id: 'insert-line-below',
        name: "Insert line below",
        repeatable: true,
        hotkeys: map.insert_line_below,
        editorCallback: (editor) => functions.insertLine(editor, VerticalDirection.DOWN)
    },
    {
        category: Category.EDITOR_LINES_MANIPULATION,
        id: 'join-selected-lines',
        name: "Join selected lines",
        hotkeys: map.join_selected_lines,
        editorCallback: (editor) => functions.replaceSelections(editor, (s) => s.replace(/\n/g, ""))
    },
    {
        category: Category.EDITOR_LINES_MANIPULATION,
        id: 'move-line-down',
        name: 'Move line down',
        repeatable: true,
        hotkeys: map.move_line_down,
        editorCallback: (editor) => functions.moveLine(editor, VerticalDirection.DOWN, editor.lineCount() - 1)
    },
    {
        category: Category.EDITOR_LINES_MANIPULATION,
        id: 'move-line-up',
        name: 'Move line up',
        repeatable: true,
        hotkeys: map.move_line_up,
        editorCallback: (editor) => functions.moveLine(editor, VerticalDirection.UP, 0)
    },
    {
        category: Category.EDITOR_LINES_MANIPULATION,
        id: 'reverse-selected-lines',
        name: "Reverse selected lines",
        hotkeys: map.reverse_selected_lines,
        editorCallback: (editor) => functions.reverseSelectedLines(editor)
    },
    {
        category: Category.EDITOR_LINES_MANIPULATION,
        id: 'shuffle-selected-lines',
        name: "Shuffle selected lines",
        hotkeys: map.shuffle_selected_lines,
        editorCallback: (editor) => functions.shuffleSelectedLines(editor, plugin.settings.shuffle_rounds_amount)
    },
    {
        category: Category.EDITOR_LINES_MANIPULATION,
        id: 'sort-selected-lines',
        name: "Sort selected lines",
        hotkeys: map.sort_selected_lines,
        editorCallback: (editor) => functions.sortSelectedLines(editor)
    },
    {
        category: Category.INSERT_COMPONENTS,
        id: 'better-insert-callout',
        name: "Better insert callout",
        hotkeys: map.better_insert_callout,
        editorCallback: (editor) => new CalloutPickerModal(plugin,
            (item) => functions.insertCallout(editor, item)
        ).open()
    },
    {
        category: Category.INSERT_COMPONENTS,
        id: 'insert-code-block',
        name: "Insert code block",
        hotkeys: map.insert_code_block,
        editorCallback: (editor) => new CodeBlockModal(plugin,
            (item) => functions.insertCodeBlock(editor, item)
        ).open()
    },
    {
        category: Category.INSERT_COMPONENTS,
        id: 'insert-ordinal-numbering',
        name: "Insert ordinal numbering",
        hotkeys: map.insert_ordinal_numbering,
        editorCallback: (editor) => functions.insertOrdinalNumbering(editor)
    },
    {
        category: Category.INSERT_COMPONENTS,
        id: 'insert-table',
        name: "Insert Table",
        hotkeys: map.insert_table,
        editorCallback: (editor) => new TableModal(plugin,
            (data) => functions.insertTable(editor, data.rows, data.columns)
        ).open()
    },
    {
        category: Category.RENDERED_CONTROLING,
        id: 'close-all-foldable-callouts',
        name: "Close all foldable callouts",
        hotkeys: map.close_all_foldable_callouts,
        callback: () => document.querySelectorAll("div.callout.is-collapsible:not(.is-collapsed) div.callout-title").forEach(c => (c as HTMLDivElement).click())
    },
    {
        category: Category.RENDERED_CONTROLING,
        id: 'open-all-foldable-callouts',
        name: "Open all foldable callouts",
        hotkeys: map.open_all_foldable_callouts,
        callback: () => document.querySelectorAll("div.callout.is-collapsible.is-collapsed div.callout-title").forEach(c => (c as HTMLDivElement).click())
    },
    {
        category: Category.RENDERED_CONTROLING,
        id: 'toggle-all-callouts-fold-state',
        name: "Toggle all callouts fold state",
        hotkeys: map.toggle_all_callouts_fold_state,
        callback: () => document.querySelectorAll("div.callout div.callout-title").forEach(c => (c as HTMLDivElement).click())
    },
    {
        category: Category.REPLACE_SELECTIONS,
        id: 'multi-toggle-bold',
        name: "Multi-toggle bold",
        hotkeys: map.multi_toggle_bold,
        editorCallback: (editor) => functions.surroundWithChars(editor, "**")
    },
    {
        category: Category.REPLACE_SELECTIONS,
        id: 'multi-toggle-code',
        name: "Multi-toggle code",
        hotkeys: map.multi_toggle_code,
        editorCallback: (editor) => functions.surroundWithChars(editor, "``")
    },
    {
        category: Category.REPLACE_SELECTIONS,
        id: 'multi-toggle-comment',
        name: "Multi-toggle comment",
        hotkeys: map.multi_toggle_comment,
        editorCallback: (editor) => functions.surroundWithChars(editor, "%%")
    },
    {
        category: Category.REPLACE_SELECTIONS,
        id: 'multi-toggle-highlight',
        name: "Multi-toggle highlight",
        hotkeys: map.multi_toggle_highlight,
        editorCallback: (editor) => functions.surroundWithChars(editor, "==")
    },
    {
        category: Category.REPLACE_SELECTIONS,
        id: 'multi-toggle-italic',
        name: "Multi-toggle italic",
        hotkeys: map.multi_toggle_italic,
        editorCallback: (editor) => functions.surroundWithChars(editor, "*")
    },
    {
        category: Category.REPLACE_SELECTIONS,
        id: 'multi-toggle-strikethrough',
        name: "Multi-toggle strikethrough",
        hotkeys: map.multi_toggle_strikethrough,
        editorCallback: (editor) => functions.surroundWithChars(editor, "~~")
    },
    {
        category: Category.REPLACE_SELECTIONS,
        id: 'replace-by-regex',
        name: "Replace by Regular Expression (Regex)",
        hotkeys: map.replace_by_regex,
        editorCallback: (editor) => new RegexReplaceModal(plugin, editor.getValue(), "Replace by Regular Expression",
            (data) => functions.replaceRegex(editor, data.pattern, data.replacer, data.only_selections),
            (data) => functions.countRegexMatches(editor, data.pattern, data.only_selections)
        ).open()
    },
    {
        category: Category.REPLACE_SELECTIONS,
        id: 'toggle-case-jetbrains',
        name: "Toggle case (JetBrains)",
        hotkeys: map.toggle_case_jetbrains,
        editorCallback: (editor) => functions.replaceSelections(editor, (str) => str === str.toLowerCase() ? str.toUpperCase() : str.toLowerCase())
    },
    {
        category: Category.REPLACE_SELECTIONS,
        id: 'toggle-kebab-case',
        name: "Toggle selections kebabcase",
        hotkeys: map.toggle_kebabcase,
        editorCallback: (editor) => functions.convertOneToOtherChars(editor, " ", "-")
    },
    {
        category: Category.REPLACE_SELECTIONS,
        id: 'toggle-keyboard-input',
        name: "Toggle keyboard input (<kbd>)",
        hotkeys: map.toggle_keyboard_input,
        editorCallback: (editor) => functions.surroundWithChars(editor, "<kbd>", "</kbd>")
    },
    {
        category: Category.REPLACE_SELECTIONS,
        id: 'toggle-snake-case',
        name: "Toggle selections snakecase",
        hotkeys: map.toggle_snakecase,
        editorCallback: (editor) => functions.convertOneToOtherChars(editor, " ", "_")
    },
    {
        category: Category.REPLACE_SELECTIONS,
        id: 'toggle-underline',
        name: "Toggle underline",
        hotkeys: map.toggle_underline,
        editorCallback: (editor) => functions.surroundWithChars(editor, "<u>", "</u>")
    },
    {
        category: Category.REPLACE_SELECTIONS,
        id: 'toggle-uri-encoded-or-decoded',
        name: "Toggle selections URI encoded/decoded string",
        hotkeys: map.toggle_uri_encoded_or_decoded,
        editorCallback: (editor) => functions.convertURI(editor)
    },
    {
        category: Category.REPLACE_SELECTIONS,
        id: 'transform-selections-to-lowercase',
        name: "Transform selections to lowercase",
        hotkeys: map.transform_selections_to_lowercase,
        editorCallback: (editor) => functions.replaceSelections(editor, (s) => s.toLowerCase())
    },
    {
        category: Category.REPLACE_SELECTIONS,
        id: 'transform-selections-to-titlecase',
        name: "Transform selections to titlecase (capitalize)",
        hotkeys: map.transform_selections_to_titlecase,
        editorCallback: (editor) => functions.replaceSelections(editor, (s) => s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()))
    },
    {
        category: Category.REPLACE_SELECTIONS,
        id: 'transform-selections-to-uppercase',
        name: "Transform selections to uppercase",
        hotkeys: map.transform_selections_to_uppercase,
        editorCallback: (editor) => functions.replaceSelections(editor, (s) => s.toUpperCase())
    },
    {
        category: Category.REPLACE_SELECTIONS,
        id: 'trim-selections',
        name: "Trim selections",
        hotkeys: map.trim_selections,
        editorCallback: (editor) => functions.replaceSelections(editor, (s) => s.trim())
    },
    {
        category: Category.SELECTION_ADD_OR_REMOVE,
        id: 'add-caret-down',
        name: 'Add caret cursor down',
        repeatable: true,
        hotkeys: map.add_caret_down,
        editorCallback: (editor) => functions.addCarets(editor, VerticalDirection.DOWN, editor.lineCount())
    },
    {
        category: Category.SELECTION_ADD_OR_REMOVE,
        id: 'add-caret-up',
        name: 'Add caret cursor up',
        repeatable: true,
        hotkeys: map.add_caret_up,
        editorCallback: (editor) => functions.addCarets(editor, VerticalDirection.UP, 0)
    },
    {
        category: Category.SELECTION_ADD_OR_REMOVE,
        id: 'search-by-regex',
        name: "Search by Regular Expression (Regex)",
        hotkeys: map.search_by_regex,
        editorCallback: (editor) => new RegexSearchModal(plugin, editor.getValue(), "Search by Regular Expression",
            (data) => functions.selectByRegex(editor, data.pattern, data.only_selections),
            (data) => functions.countRegexMatches(editor, data.pattern, data.only_selections)
        ).open()
    },
    {
        category: Category.SELECTION_ADD_OR_REMOVE,
        id: 'select-all-word-instances',
        name: "Select all word instances",
        hotkeys: map.select_all_word_instances,
        editorCallback: (editor) => functions.selectAllWordInstances(editor, plugin.settings.case_sensitive)
    },
    {
        category: Category.SELECTION_ADD_OR_REMOVE,
        id: 'select-multiple-word-instances',
        name: "Select multiple word instances",
        hotkeys: map.select_multiple_word_instances,
        editorCallback: (editor) => functions.selectWordInstances(editor, plugin.settings.case_sensitive)
    },
    {
        category: Category.SELECTION_ADD_OR_REMOVE,
        id: 'split-selections-by-lines',
        name: "Split selections by lines",
        hotkeys: map.split_selections_by_lines,
        editorCallback: (editor) => functions.splitSelectionsByLines(editor)
    },
    {
        category: Category.TRANSFORM_SELECTIONS,
        id: 'expand-line-selections',
        name: "Expand line selections",
        hotkeys: map.expand_line_selections,
        editorCallback: (editor) => functions.expandSelections(editor)
    },
    {
        category: Category.TRANSFORM_SELECTIONS,
        id: 'split-selections-on-new-line',
        name: "Split selections on new line",
        hotkeys: map.split_selections_on_new_line,
        editorCallback: (editor) => functions.splitSelectedTextOnNewLine(editor)
    },
    {
        category: Category.TRANSFORM_SELECTIONS,
        id: 'go-to-next-fold',
        name: "Go to next fold",
        hotkeys: map.go_to_next_fold,
        editorCallback: (editor) => functions.goToNextFolding(editor)
    },
    {
        category: Category.TRANSFORM_SELECTIONS,
        id: 'go-to-previous-fold',
        name: "Go to previous fold",
        hotkeys: map.go_to_previous_fold,
        editorCallback: (editor) => functions.goToPreviousFolding(editor)
    },
    {
        category: Category.TRANSFORM_SELECTIONS,
        id: 'go-to-parent-fold',
        name: "Go to parent fold",
        hotkeys: map.go_to_parent_fold,
        editorCallback: (editor) => functions.goToParentFolding(editor)
    },
    {
        category: Category.OBSIDIAN_SETTINGS,
        id: 'switch-inline-title-setting',
        name: "Switch 'inline title' setting",
        hotkeys: map.switch_inline_title_setting,
        callback: () => functions.flipBooleanSetting(plugin.app, 'showInlineTitle')
    },
    {
        category: Category.OBSIDIAN_SETTINGS,
        id: 'switch-line-numbers-setting',
        name: "Switch 'line numbers' setting",
        hotkeys: map.switch_line_numbers_setting,
        callback: () => functions.flipBooleanSetting(plugin.app, 'showLineNumber')
    },
    {
        category: Category.OBSIDIAN_SETTINGS,
        id: 'switch-readable-length-setting',
        name: "Switch 'readable line length' setting",
        hotkeys: map.switch_readable_length_setting,
        callback: () => functions.flipBooleanSetting(plugin.app, 'readableLineLength')
    },
    {
        category: Category.OTHER,
        id: 'open-dev-tools',
        name: "Open developer tools",
        hotkeys: map.open_dev_tools,
        callback: () => electron.remote.getCurrentWindow().webContents.openDevTools()
    },
    {
        category: Category.OTHER,
        id: 'toggle-focus-mode',
        name: "Toggle focus mode",
        hotkeys: map.toggle_focus_mode,
        callback: () => functions.toggleFocusMode()
    },
    {
        category: Category.KEYSHOTS_SETTINGS,
        id: 'change-keyshots-preset',
        name: "Change Keyshots preset",
        hotkeys: map.change_keyshots_preset,
        callback: () => new IDEPresetModal(plugin).open()
    },
    {
        category: Category.KEYSHOTS_SETTINGS,
        id: 'open-keyshots-settings-tab',
        name: "Open Keyshots settings tab",
        hotkeys: map.open_keyshots_settings_tab,
        callback: () => functions.openKeyshotsSettings(app)
    },
    {
        category: Category.KEYSHOTS_SETTINGS,
        id: 'switch-keyshots-case-sensitivity',
        name: "Switch Keyshots case sensitivity",
        hotkeys: map.switch_keyshots_case_sensitivity,
        callback: () => functions.toggleCaseSensitivity(plugin)
    },
]

declare interface PluginConditionalObject<T> {
    conditional: (plugin: KeyshotsPlugin) => boolean,
    object: T
}


export const DOUBLE_KEY_COMMANDS = (plugin: KeyshotsPlugin): PluginConditionalObject<DoubleKeyCommand>[] => [
    {
        conditional: (plugin) => plugin.settings.carets_via_double_ctrl || plugin.settings.command_palette_via_double_ctrl,
        object: {
            id: "add-caret-and-open-command-palette",
            name: "Add caret cursors and open Command-Palette",
            key: "Control",
            maxDelay: 400,
            anotherKeyPressedCallback:
                plugin.settings.carets_via_double_ctrl
                ? (ev) => functions.addCaretsViaDoubleKey(plugin, ev)
                : undefined
            ,
            lastReleasedCallback:
                plugin.settings.command_palette_via_double_ctrl
                ? (interrupted) => {
                    if (!interrupted) functions.runCommandById(plugin, "command-palette:open",
                        () => new Notice("Command Pallete plugin is not enabled!")
                    )
                }
                : undefined
        }
    },
    {
        conditional: (plugin) => plugin.settings.quick_switch_via_double_shift,
        object: {
            id: "quick-open",
            name: "Open Quick-Switcher",
            key: "Shift",
            maxDelay: 400,
            lastReleasedCallback: (interrupted) => {
                if (!interrupted) functions.runCommandById(plugin, "switcher:open",
                    () => new Notice("Quick Switcher plugin is not enabled!")
                )
            }

        }
    }
]