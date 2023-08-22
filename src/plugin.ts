import {Plugin} from 'obsidian';
import {mapBySettings} from "./mappings/hotkeys";
import {DEFAULT_SETTINGS, KeyshotsSettings} from "./settings";
import {COMMANDS, DOUBLE_KEY_COMMANDS} from "./commands";
import DoubleKeyRegistry from "./classes/double-key-registry";
import {KeyshotsSettingTab} from "./components/settings-tab";


export default class KeyshotsPlugin extends Plugin {

    settings: KeyshotsSettings
    private commandIds: Set<string>
    private doubleKeyRegistry: DoubleKeyRegistry

    async onload() {
        await this.loadSettings()
        this.addSettingTab(new KeyshotsSettingTab(this.app, this))
        this.doubleKeyRegistry = new DoubleKeyRegistry(this)
        this.loadDoubleKeyCommands()
        this.loadCommands()
    }

    loadCommands() {
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

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

