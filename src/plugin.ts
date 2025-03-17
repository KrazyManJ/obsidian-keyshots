import {Command, Hotkey, Plugin} from 'obsidian';
import KeyshotsSettings from "./model/KeyshotsSettings";
import {DOUBLE_KEY_COMMANDS} from "./commands";
import DoubleKeyRegistry from "./classes/DoubleKeyRegistry";
import {KeyshotsSettingTab} from "./components/settings-tab";
import KeyshotsCommand from "./model/KeyshotsCommand";
import {PRESETS_INFO, Preset} from "./constants/Presets";
import DEFAULT_KEYSHOTS_SETTINGS from "./constants/DefaultKeyshotsSettings";

import {duplicateLineDown, duplicateLineUp} from "./commands/duplicate-line";
import {duplicateSelectionOrLine} from "./commands/duplicate-selection-or-line";
import {insertLineAbove, insertLineBelow} from "./commands/insert-line";
import {joinSelectedLines} from "./commands/join-selected-lines";
import {moveSelectedLinesDown, moveSelectedLinesUp} from "./commands/move-selected-lines";
import {reverseSelectedLines} from "./commands/reverse-selected-lines";
import {shuffleSelectedLines} from "./commands/shuffle-selected-lines";
import {sortSelectedLines} from "./commands/sort-selected-lines";
import {betterInsertCallout} from "./commands/better-insert-callout";
import {addCaretDown, addCaretUp} from "./commands/add-caret";
import {expandLineSelection} from "./commands/expand-line-selection";
import {selectAllWordInstances} from "./commands/select-all-word-instances";
import {selectMultipleWordInstances} from "./commands/select-multiple-word-instances";
import {toggleCaseJetbrains} from "./commands/toggle-case-jetbrains";
import {transformSelectionsToLowercase} from "./commands/transform-selections-to-lowercase";
import {transformSelectionsToUppercase} from "./commands/transform-selections-to-uppercase";
import {reopenCurrentNote} from "./commands/reopen-current-note";
import {insertCodeBlock} from "./commands/insert-code-block";
import {insertOrdinalNumbering} from "./commands/insert-ordinal-numbering";
import {insertTable} from "./commands/insert-table";
import {closeAllFoldableCallouts} from "./commands/close-all-foldable-callouts";
import {openAllFoldableCallouts} from "./commands/open-all-foldable-callouts";
import {toggleAllCalloutsFoldState} from "./commands/toggle-all-callouts-fold-state";
import {replaceByRegex} from "./commands/replace-by-regex";
import {toggleKebabCase} from "./commands/toggle-kebab-case";
import {toggleKeyboardInput} from "./commands/toggle-keyboard-input";
import {toggleSnakeCase} from "./commands/toggle-snake-case";
import {toggleUnderline} from "./commands/toggle-underline";
import {toggleUriEncodedOrDecoded} from "./commands/toggle-uri-encoded-or-decoded";
import {transformSelectionsToTitlecase} from "./commands/transform-selections-to-titlecase";
import {trimSelections} from "./commands/trim-selections";
import {searchByRegex} from "./commands/search-by-regex";
import {splitSelectionsByLines} from "./commands/split-selections-by-lines";
import {splitSelectionsOnNewLine} from "./commands/split-selections-on-new-line";
import {goToNextFold, goToPreviousFold} from "./commands/go-to-prev-next-fold";
import {goToParentFold} from "./commands/go-to-parent-fold";
import {switchInlineTitleSetting} from "./commands/switch-inline-title-setting";
import {switchLineNumbersSetting} from "./commands/switch-line-numbers-setting";
import {switchReadableLineLength} from "./commands/switch-readable-line-length";
import {openDevTools} from "./commands/open-dev-tools";
import {toggleFocusMode} from "./commands/toggle-focus-mode";
import {changeKeyshotsPreset} from "./commands/change-keyshots-preset";
import {openKeyshotsSettingsTab} from "./commands/open-keyshots-settings-tab";
import {switchKeyshotsCaseSensitivity} from "./commands/switch-keyshots-case-sensitivity";


export default class KeyshotsPlugin extends Plugin {

    settings: KeyshotsSettings
    // private commandIds: Set<string>
    private doubleKeyRegistry: DoubleKeyRegistry


    private keyshotsCommandToObsidianCommand(
        cmd: KeyshotsCommand,
        preset: Preset,
        includeKeyshots: boolean
    ): Command {
        let hotkeys: Hotkey[] | null | undefined = undefined
        if (cmd.hotkeys) {
            hotkeys = cmd.hotkeys[preset]
            if (includeKeyshots && hotkeys === undefined) hotkeys = cmd.hotkeys["keyshots"]
        }
        if (hotkeys === null)
            hotkeys = undefined
        return {...cmd, ...{hotkeys: hotkeys}}
    }

    private registerPluginCommands() {
        const commands: KeyshotsCommand[] = [
            duplicateLineUp,
            duplicateLineDown,
            duplicateSelectionOrLine,
            insertLineAbove,
            insertLineBelow,
            joinSelectedLines,
            moveSelectedLinesDown,
            moveSelectedLinesUp,
            reverseSelectedLines,
            shuffleSelectedLines(this),
            sortSelectedLines,
            betterInsertCallout(this),
            addCaretDown,
            addCaretUp,
            expandLineSelection,
            selectAllWordInstances(this),
            selectMultipleWordInstances(this),
            toggleCaseJetbrains,
            transformSelectionsToLowercase,
            transformSelectionsToUppercase,
            reopenCurrentNote,
            insertCodeBlock(this),
            insertOrdinalNumbering,
            insertTable(this),
            closeAllFoldableCallouts,
            openAllFoldableCallouts,
            toggleAllCalloutsFoldState,
            replaceByRegex(this),
            toggleKebabCase,
            toggleKeyboardInput,
            toggleSnakeCase,
            toggleUnderline,
            toggleUriEncodedOrDecoded,
            transformSelectionsToTitlecase,
            trimSelections,
            searchByRegex(this),
            splitSelectionsByLines,
            splitSelectionsOnNewLine,
            goToNextFold,
            goToPreviousFold,
            goToParentFold,
            switchInlineTitleSetting(this),
            switchLineNumbersSetting(this),
            switchReadableLineLength(this),
            openDevTools,
            toggleFocusMode,
            changeKeyshotsPreset(this),
            openKeyshotsSettingsTab,
            switchKeyshotsCaseSensitivity(this)
        ]
        const preset = this.settings.ide_mappings
        this._events = this._events.filter(e => !e.toString().contains(".removeCommand("))
        commands.forEach(c => {
            app.commands.removeCommand("keyshots:"+c.id)
            this.addCommand(this.keyshotsCommandToObsidianCommand(c,preset,this.settings.keyshot_mappings))
        })
    }

    async onload() {
        await this.loadSettings()
        this.addSettingTab(new KeyshotsSettingTab(this.app, this))
        this.doubleKeyRegistry = new DoubleKeyRegistry(this)
        this.loadDoubleKeyCommands()
        this.loadCommands()
    }

    loadCommands() {
        this.registerPluginCommands()
        // if (this.commandIds !== undefined) {
        //     this.commandIds.forEach(cmd => this.app.commands.removeCommand(cmd))
        //     this._events = this._events.filter(e => !e.toString().contains(".removeCommand("))
        // }
        // this.commandIds = new Set(COMMANDS(this, mapBySettings(this)).map(cmd => this.addCommand(cmd).id));
    }

    loadDoubleKeyCommands() {
        this.doubleKeyRegistry.unregisterAllCommands()
        DOUBLE_KEY_COMMANDS(this)
            .filter(cmd => cmd.conditional(this))
            .forEach(cmd => this.doubleKeyRegistry.registerCommand(cmd.object))
    }

    public async changePreset(presetId: Preset) {
        if (!Object.keys(PRESETS_INFO).contains(presetId)) {
            console.warn("Keyshots: Invalid attempt to change Keyshots mappings preset, incorrect preset ID.")
            return;
        }
        this.settings.ide_mappings = presetId;
        this.loadCommands()
        await this.saveSettings()
    }

    public availablePresets() {
        return Object.keys(PRESETS_INFO)
    }

    public getPresetTitle(presetId: Preset) {
        return PRESETS_INFO[presetId].name
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_KEYSHOTS_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    setSetting<K extends keyof KeyshotsSettings>(key: K, value: KeyshotsSettings[K]) {
        this.settings[key] = value;
        this.saveSettings().then();
    }
}

