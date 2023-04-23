import "obsidian";

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
        vault: Vault
    }
}

