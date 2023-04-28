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
        removeCommand(...id: string[]): void;
        executeCommandById(id: string): boolean;
    }

    interface SettingManager {
        activeTab: object

        open(): void

        openTabById(id: string): void
    }

    interface InternalPlugin extends Plugin {
        enabled: boolean
    }

    interface PluginManager {
        plugins: Record<string,InternalPlugin>
    }

    interface App {
        commands: CommandManager
        setting: SettingManager
        vault: Vault
        internalPlugins: PluginManager
    }


    interface Plugin {
        _events: (() => void)[]
    }
}

