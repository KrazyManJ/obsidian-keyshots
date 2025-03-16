import {Command, Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, KeyshotsSettings} from "./model/KeyshotsSettings";
import {COMMANDS, DOUBLE_KEY_COMMANDS} from "./commands";
import DoubleKeyRegistry from "./classes/DoubleKeyRegistry";
import {KeyshotsSettingTab} from "./components/settings-tab";
import {IDE_LABELS} from "./mappings/ide-info";
import KeyshotsCommand from "./model/KeyshotsCommand";
import {Preset} from "./model/Preset";

import {duplicateLineDown, duplicateLineUp} from "./commands/duplicate-line";
import {duplicateSelectionOrLine} from "./commands/duplicate-selection-or-line";
import {insertLineAbove, insertLineBelow} from "./commands/insert-line";
import {mapBySettings} from "./mappings/hotkeys";


export default class KeyshotsPlugin extends Plugin {

    settings: KeyshotsSettings
    private commandIds: Set<string>
    private doubleKeyRegistry: DoubleKeyRegistry


    private keyshotsCommandToObsidianCommand(cmd: KeyshotsCommand, preset: Preset): Command {
        return {...cmd, ...{hotkeys: cmd.hotkeys ? cmd.hotkeys[preset] : undefined}}
    }

    private registerPluginCommands() {
        const commands: KeyshotsCommand[] = [
            duplicateLineUp,
            duplicateLineDown,
            duplicateSelectionOrLine,
            insertLineAbove,
            insertLineBelow
        ]
        const preset = Preset[this.settings.ide_mappings.toUpperCase() as keyof typeof Preset]
        this._events = this._events.filter(e => !e.toString().contains(".removeCommand("))
        commands.forEach(c => {
            app.commands.removeCommand("keyshots:"+c.id)
            this.addCommand(this.keyshotsCommandToObsidianCommand(c,preset))
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
        if (this.commandIds !== undefined) {
            this.commandIds.forEach(cmd => this.app.commands.removeCommand(cmd))
            this._events = this._events.filter(e => !e.toString().contains(".removeCommand("))
        }
        this.commandIds = new Set(COMMANDS(this, mapBySettings(this)).map(cmd => this.addCommand(cmd).id));
    }

    loadDoubleKeyCommands() {
        this.doubleKeyRegistry.unregisterAllCommands()
        DOUBLE_KEY_COMMANDS(this)
            .filter(cmd => cmd.conditional(this))
            .forEach(cmd => this.doubleKeyRegistry.registerCommand(cmd.object))
    }

    public async changePreset(presetId: string) {
        if (!Object.keys(IDE_LABELS).contains(presetId)) {
            console.warn("Keyshots: Invalid attempt to change Keyshots mappings preset, incorrect preset ID.")
            return;
        }
        this.settings.ide_mappings = presetId;
        this.loadCommands()
        await this.saveSettings()
    }

    public availablePresets() {
        return Object.keys(IDE_LABELS)
    }

    public getPresetTitle(presetId: string) {
        return IDE_LABELS[presetId].name
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    setSetting<K extends keyof KeyshotsSettings>(key: K, value: KeyshotsSettings[K]) {
        this.settings[key] = value;
        this.saveSettings().then();
    }
}

