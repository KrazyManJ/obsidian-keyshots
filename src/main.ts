import {Plugin} from 'obsidian';
import {mapBySettings} from "./mappings";
import {DEFAULT_SETTINGS, KeyshotsSettings, KeyshotsSettingTab} from "./settings";
import {COMMANDS} from "./commands";


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
        this.command_ids = new Set(...COMMANDS(this,mapBySettings(this)).map(cmd => this.addCommand(cmd).id));
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

