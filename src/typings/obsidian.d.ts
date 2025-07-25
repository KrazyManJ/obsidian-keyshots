import "obsidian";

declare module 'obsidian' {
    interface VaultConfig {
        readableLineLength: boolean
        showLineNumber: boolean
        livePreview: boolean
        showInlineTitle: boolean
        tabSize: number
        useTabs: boolean
    }

    interface MarkdownView {
        getState(): {
            source: boolean
        }
    }

    interface Vault {
        getConfig<T extends keyof VaultConfig>(config: T): VaultConfig[T];

        setConfig<T extends keyof VaultConfig>(config: T, value: VaultConfig[T]): void;
    }

    interface ACommand {
        id: string
        name: string
    }

    interface CommandManager {
        removeCommand(...id: string[]): void;

        executeCommandById(id: string): boolean;

        executeCommand(e: Command, t: unknown): boolean;

        commands: Record<string, ACommand>
    }

    interface SettingManager {
        activeTab: object

        open(): void

        openTabById(id: string): void
    }

    interface InternalPlugin extends Plugin {
        enabled: boolean
    }

    interface InternalPluginManager {
        plugins: Record<string, InternalPlugin>
    }

    interface CommunityPluginManager {
        enabledPlugins: Set<string>
    }

    interface App {
        commands: CommandManager
        setting: SettingManager
        vault: Vault
        internalPlugins: InternalPluginManager
        plugins: CommunityPluginManager
    }


    interface Plugin {
        _events: (() => void)[]
    }
}

