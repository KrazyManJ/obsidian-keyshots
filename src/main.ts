import {Plugin} from 'obsidian';
import {mapBySettings} from "./mappings";
import {DEFAULT_SETTINGS, KeyshotsSettings, KeyshotsSettingTab} from "./settings";
import {COMMANDS} from "./commands";


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
        this.command_ids = new Set(...COMMANDS(this,mapBySettings(this)).map(cmd => this.addCommand(cmd).id));
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

