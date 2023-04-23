import {
    App,
    Editor,
    EditorRange,
    EditorSelection,
    Notice,
    Plugin,
    PluginSettingTab,
    Setting,
    SliderComponent,
    VaultConfig
} from 'obsidian';
import EditorSelectionManipulator from "./src/classes/EditorSelectionManipulator";
import {DEFAULT_MAP, KEYSHOTS_MAPS} from "./src/Mappings";
import {VerticalDirection} from "./src/Utils";
import {DocumentFragmentBuilder} from "./src/classes/DocumentFragmentBuilder";


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




const flipBooleanSetting = (app: App, setting: keyof VaultConfig) => app.vault.setConfig(setting, !app.vault.getConfig(setting))

const replaceSelections = (editor: Editor, transformFct: (val: string) => string) => {
    EditorSelectionManipulator.listSelections(editor).filter(s => !s.isCaret()).forEach(sel =>
        sel.normalize().replaceText(transformFct(sel.normalize().getText()))
    )
}

const selectionsProcessor = (
    editor: Editor,
    arrCallback: ((arr: EditorSelectionManipulator[]) => EditorSelectionManipulator[]) | undefined,
    fct: (sel: EditorSelectionManipulator, index: number) => EditorSelection
) => {
    const selections: EditorSelection[] = [];
    (arrCallback !== undefined
        ? arrCallback(EditorSelectionManipulator.listSelections(editor)) : EditorSelectionManipulator.listSelections(editor))
        .forEach((sel, index) => selections.push(fct(sel, index)))
    if (selections.length > 0) editor.setSelections(selections)
}

const selectionsUpdater = (
    editor: Editor,
    arrCallback: ((arr: EditorSelection[]) => EditorSelection[]) | undefined,
    fct: (sel: EditorSelectionManipulator, index: number) => EditorSelection[]
) => {
    const selections: EditorSelection[] = [];
    (arrCallback !== undefined
        ? arrCallback(editor.listSelections()) : editor.listSelections())
        .forEach((sel, index) => selections.push(...fct(new EditorSelectionManipulator(sel, editor), index)))
    if (selections.length > 0) editor.setSelections(selections)
}

const selectionsEqual = (one: EditorSelection, two: EditorSelection) => {
    return one.anchor.ch === two.anchor.ch
        && one.anchor.line === two.anchor.line
        && one.head.line === two.head.line
        && one.head.ch === two.head.ch
}
const convertOneToOtherChars = (editor: Editor, first: string, second: string) => {
    replaceSelections(editor, (tx) => {
        const [underI, spaceI] = [tx.indexOf(first), tx.indexOf(second)]
        const replaceFromTo = (s: string, ch1: string, ch2: string) => s.replace(new RegExp(ch1, "gm"), ch2)
        if (underI !== -1 || spaceI !== -1) return tx
        if (underI === -1) return replaceFromTo(tx, second, first)
        if (spaceI === -1) replaceFromTo(tx, first, second)
        if (underI > spaceI) return replaceFromTo(tx, second, first)
        return replaceFromTo(tx, first, second)
    })
}

// =================================================================================================================
// FUNCTIONS
// =================================================================================================================

function moveLine(editor: Editor, direction: VerticalDirection, border: number) {
    selectionsProcessor(editor, undefined, (sel) => {
        if (direction === 1 ? sel.asNormalized().head.line === border : sel.asNormalized().anchor.line === border) return sel
        const replaceSel = sel.asNormalized().moveLines(
            direction === -1 ? direction : 0,
            direction === 1 ? direction : 0
        ).expand()
        const tx = replaceSel.getText()
        if (sel.isCaret()) replaceSel.replaceText(tx.split("\n").reverse().join("\n"))
        else {
            const pieces = [
                tx.split("\n").slice(...(direction === 1 ? [-1] : [0, 1]))[0],
                tx.split("\n").slice(...(direction === 1 ? [undefined, -1] : [1])).join("\n")
            ]
            if (direction === -1) pieces.reverse()
            replaceSel.replaceText(pieces.join("\n"))
        }
        return sel.moveLines(direction)
    })
}

function jetBrainsDuplicate(editor: Editor) {
    selectionsProcessor(editor, undefined, (sel) => {
        if (sel.isCaret()) {
            const tx = sel.anchor.getLine()
            sel.anchor.setLine(tx + "\n" + tx)
            return sel.moveLines(1)
        } else {
            const tx = sel.asNormalized().getText()
            return sel.asNormalized().replaceText(tx + tx).moveChars(tx.length)
        }
    })
}

function vscodeDuplicate(editor: Editor, direction: VerticalDirection) {
    selectionsProcessor(editor, undefined, (sel) => {
        if (sel.isCaret()) {
            const tx = sel.anchor.getLine()
            sel.anchor.setLine(tx + "\n" + tx)
            if (direction > 0) return sel.moveLines(1);
        } else {
            const replaceSel = sel.asNormalized().expand()
            const tx = replaceSel.getText()
            replaceSel.replaceText(tx + "\n" + tx)
            if (direction > 0) return sel.moveLines(sel.linesCount + 1)
        }
        return sel
    })
}

function addCarets(editor: Editor, direction: VerticalDirection, border: number) {
    const newSelections: EditorSelectionManipulator[] = EditorSelectionManipulator.listSelections(editor)
    const caretSelectsOnly = newSelections.filter(val => val.isCaret())
    if (caretSelectsOnly.length === 0) return;
    const last = caretSelectsOnly[direction > 0 ? caretSelectsOnly.length - 1 : 0]
    if (last.anchor.line === border) return;
    newSelections.push(last.clone().moveLines(direction))
    editor.setSelections(newSelections)
    editor.scrollIntoView(last.anchor.movePos(direction * 2, 0).asEditorRange())
}

function insertLine(editor: Editor, direction: VerticalDirection) {
    selectionsProcessor(editor, (s) => s.sort((a, b) => a.anchor.line - b.anchor.line), (sel, index) => {
        const a = (ln: number) => {
            const tx = [editor.getLine(ln), "\n"]
            if (direction < 0) tx.reverse()
            editor.setLine(ln, tx.join(""))
            return EditorSelectionManipulator.documentStart(editor).setLines(ln, direction > 0 ? direction : 0)
        }
        if (sel.isCaret()) return a(sel.anchor.line + index)
        else {
            const normSel = sel.asNormalized()
            return a((direction > 0 ? normSel.anchor.line : normSel.head.line) + index)
        }
    })
}

function convertURI(editor: Editor) {
    replaceSelections(editor, (s) => {
        try {
            const decoded = decodeURI(s)
            if (decoded === s) return encodeURI(s)
            return decoded;
        } catch {
            return encodeURI(s)
        }
    })
}

const titleCase = (s: string) => s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())

function splitSelectedTextOnNewLine(editor: Editor) {
    let index = 0
    selectionsProcessor(editor, arr => arr.sort((a, b) => a.anchor.line - b.anchor.line), sel => {
        if (sel.isCaret()) return sel
        else {
            const replaceSel = sel.moveLines(index).normalize()
            const tx = replaceSel.getText()
            replaceSel.replaceText("\n" + tx + "\n")
            index += (tx.split("\n") || []).length + 1
            return sel.moveLines(1).expand()
        }
    })
}

function sortSelectedLines(editor: Editor) {
    selectionsProcessor(editor, arr => arr.filter(s => !s.isCaret()), sel => {
        const replaceSel = sel.asNormalized().expand()
        replaceSel.replaceText(replaceSel.getText()
            .split("\n")
            .sort((a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: "base"}))
            .join("\n")
        )
        return sel
    })
}

const lowestSelection = (selections: EditorSelectionManipulator[]): EditorSelectionManipulator => {

    return selections.filter((sel, _i, arr) =>
        sel.asNormalized().head.line === Math.max(...arr.map(s => s.asNormalized().head.line))
    ).filter((sel, _i, arr) =>
        sel.asNormalized().head.ch === Math.max(...arr.map(s => s.asNormalized().head.ch))
    )[0]
}
const selectionValuesEqual = (editor: Editor, selections: EditorSelectionManipulator[], case_sensitive: boolean): boolean => {
    return selections.every((val, _i, arr) => {
        const [one, two] = [arr[0], val].map(s => s.asNormalized().getText())
        if (!case_sensitive) return one.toLowerCase() === two.toLowerCase()
        return one === two
    })
}

function selectWord(sel: EditorSelectionManipulator): EditorSelectionManipulator {
    sel = sel.asNormalized().setLines(sel.anchor.line)
    const txt = sel.anchor.getLine()
    const postCh = (txt.substring(sel.anchor.ch).match(/^[^ ()[\]{},;]+/i) ?? [""])[0].length
    const preCh = (txt.substring(0, sel.anchor.ch).match(/[^ ()[\]{},;]+$/i) ?? [""])[0].length
    return sel.setChars(sel.anchor.ch).moveChars(-preCh, postCh)
}

function selectWordInstances(editor: Editor, case_sensitive: boolean) {
    const selections: EditorSelectionManipulator[] = EditorSelectionManipulator.listSelections(editor)
    let range: EditorRange | undefined;
    if (selections.filter(s => s.isCaret()).length > 0) {
        selections.filter(s => s.isCaret()).forEach((sel, i) => selections[i] = selectWord(sel))
    } else if (selections.filter(s => !s.isCaret()).length === selections.length && selectionValuesEqual(editor, selections, case_sensitive)) {
        const sel = lowestSelection(selections).normalize()
        const tx = !case_sensitive ? sel.getText().toLowerCase() : sel.getText()

        const match = (!case_sensitive ? editor.getValue().toLowerCase() : editor.getValue()).substring(sel.head.toOffset()).match(tx)
        if (match !== null) {
            const matchSel = EditorSelectionManipulator.documentStart(editor).setChars(sel.head.toOffset())
                .moveChars(match.index ?? 0, (match.index ?? 0) + tx.length)
            selections.push(matchSel)
            range = matchSel.asEditorRange()
        } else {
            let editorSearchText = !case_sensitive ? editor.getValue().toLowerCase() : editor.getValue()
            let shift = 0
            let match = editorSearchText.match(tx)
            while (match !== null) {
                const prevTx = (!case_sensitive ? editor.getValue().toLowerCase() : editor.getValue()).substring(0, shift + (match?.index || 0))
                const sel = EditorSelectionManipulator.documentStart(editor).moveChars(prevTx.length, prevTx.length + tx.length)
                if (selections.filter(s => selectionsEqual(sel, s)).length === 0) {
                    selections.push(sel)
                    range = sel.asEditorRange()
                    break;
                } else {
                    shift += (match?.index || 0) + tx.length
                    editorSearchText = editorSearchText.substring((match?.index || 0) + tx.length)
                }
                match = editorSearchText.match(tx)
            }
        }
    } else return;
    editor.setSelections(selections);
    if (range !== undefined) editor.scrollIntoView(range);
}

function selectAllWordInstances(editor: Editor, case_sensitive: boolean) {
    const selections: EditorSelectionManipulator[] = EditorSelectionManipulator.listSelections(editor)
    selections.filter(s => s.isCaret()).forEach((sel, i) => selections[i] = selectWord(sel))
    if (selections.filter(s => !s.isCaret()).length === selections.length && selectionValuesEqual(editor, selections, case_sensitive)) {
        const tx = selections[0].getText()
        Array.from(editor.getValue().matchAll(new RegExp(tx, "g" + (case_sensitive ? "" : "i"))), v => v.index || 0)
            .forEach(v => {
                selections.push(EditorSelectionManipulator.documentStart(editor).moveChars(v, v + tx.length))
            })
    } else return;
    editor.setSelections(selections);
}

function expandSelections(editor: Editor) {
    selectionsProcessor(editor, undefined, sel => sel.expand())
}

async function toggleCaseSensitivity(plugin: KeyshotsPlugin) {
    plugin.settings.case_sensitive = !plugin.settings.case_sensitive
    const val = plugin.settings.case_sensitive
    new Notice(`${val ? "🔒" : "🔓"} Keyshots actions are now case ${val ? "" : "in"}sensitive!`)
    await plugin.saveSettings()
}

function splitSelectionsByLines(editor: Editor) {
    selectionsUpdater(editor, undefined, sel => {
        const selections: EditorSelection[] = [];
        if (sel.isCaret() || sel.isOneLine()) selections.push(sel)
        else {
            sel.normalize()
            selections.push(sel.clone().setLines(sel.anchor.line).setChars(sel.anchor.ch, editor.getLine(sel.anchor.line).length))
            for (let i = sel.anchor.line + 1; i < sel.head.line; i++)
                selections.push(sel.clone().setLines(i).setChars(0, editor.getLine(i).length))
            selections.push(sel.clone().setLines(sel.head.line).setChars(0, sel.head.ch))
        }
        return selections
    })
}

function shuffleSelectedLines(editor: Editor, rounds: number) {
    selectionsProcessor(editor, arr => arr.filter(s => !s.isCaret()), sel => {
        const replaceSel = sel.asNormalized().expand()
        let txt = replaceSel.getText()
        for (let i = 0; i < rounds; i++) txt = txt.split("\n").sort(() => Math.random() - 0.5).join("\n")
        replaceSel.replaceText(txt)
        return sel
    })
}

function openKeyshotsSettings(app: App) {
    if (app.setting.activeTab === null) app.setting.open()
    app.setting.openTabById("keyshots")
}



const DEFAULT_SETTINGS: KeyshotsSettings = {
    ide_mappings: "clear",
    keyshot_mappings: true,
    case_sensitive: true,
    shuffle_rounds_amount: 10
}

declare interface KeyshotsSettings {
    ide_mappings: string;
    keyshot_mappings: boolean;
    case_sensitive: boolean;
    shuffle_rounds_amount: number
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

class KeyshotsSettingTab extends PluginSettingTab {
    plugin: KeyshotsPlugin;

    constructor(app: App, plugin: KeyshotsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const {containerEl} = this;
        containerEl.empty()
        containerEl.createEl('h1', {text: "Keyshots Settings"})
        containerEl.createEl('h2', {text: "⌨️ Default keys"})
        new Setting(containerEl)
            .setName("IDE Keys Mapping")
            .setDesc("Change default hotkeys based on IDE, that you are comfortable with. This does not overwrite your custom hotkeys!")
            .setDesc(new DocumentFragmentBuilder()
                .appendText("Change default hotkeys based on IDE, that you are comfortable with.")
                .createElem("br")
                .createElem("b", {text: "❗This does not overwrite your custom Keyshots hotkeys configuration!"})
                .toFragment()
            )
            .addDropdown(cb => cb
                .addOptions({
                    "clear": "Clear (everything blank; default)",
                    "vscode": "Visual Studio Code",
                    "jetbrains": "JetBrains IDEs (IntelliJ IDEA, Pycharm, ... )",
                    "visual_studio": "Microsoft Visual Studio",
                    "keyshots": "Keyshots default hotkeys mappings"
                })
                .setValue(this.plugin.settings.ide_mappings)
                .onChange(async (value) => {
                    this.plugin.settings.ide_mappings = value
                    await this.plugin.loadCommands()
                    await this.plugin.saveSettings()
                })
            )
        new Setting(containerEl)
            .setName("Default Keyshots hotkeys")
            .setDesc(new DocumentFragmentBuilder()
                .appendText("Sets default hotkeys for keyshots commands, that are not modified by IDE preset.")
                .createElem("br")
                .createElem("b", {text: "❗If you select clear preset, this setting will be ignored!"})
                .toFragment()
            )
            .addToggle(cb => cb
                .setValue(this.plugin.settings.keyshot_mappings)
                .onChange(async (value) => {
                    this.plugin.settings.keyshot_mappings = value
                    await this.plugin.loadCommands()
                    await this.plugin.saveSettings()
                })
            )
        containerEl.createEl('h2', {text: "🔧 Commands settings"})
        new Setting(containerEl)
            .setName("Case sensitivity")
            .setDesc(new DocumentFragmentBuilder()
                .appendText("Determines if Keyshots commands should be case sensitive. For toggling while editing text just simply use ")
                .createElem("kbd", {text: " Ctrl + Alt + I "})
                .appendText(" hotkey if you are using default Keyshots binding!")
                .toFragment()
            )
            .addToggle(cb => cb
                .setValue(this.plugin.settings.case_sensitive)
                .onChange(async (value) => {
                    this.plugin.settings.case_sensitive = value
                    await this.plugin.saveSettings()
                })
            )

        let slider: SliderComponent;
        new Setting(containerEl)
            .setName("Shuffle rounds amount")
            .setDesc(new DocumentFragmentBuilder()
                .appendText("Number of rounds that will ")
                .createElem("code", {text: "Shuffle selected lines"})
                .appendText(" command take. The more rounds it will take, the more random it will be!")
                .toFragment()
            )
            .addSlider(cb => {
                slider = cb
                slider.setValue(this.plugin.settings.shuffle_rounds_amount)
                    .setLimits(1, 50, 1)
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.plugin.settings.shuffle_rounds_amount = value
                        await this.plugin.saveSettings()
                    })
            })
            .addButton(cb => cb
                .setIcon("refresh-ccw")
                .setTooltip("Reset to default")
                .onClick(async () => {
                    this.plugin.settings.shuffle_rounds_amount = DEFAULT_SETTINGS.shuffle_rounds_amount
                    slider.setValue(DEFAULT_SETTINGS.shuffle_rounds_amount)
                    await this.plugin.saveSettings()
                })
            )
    }
}
