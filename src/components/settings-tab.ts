import {App, Component, MarkdownRenderer, PluginSettingTab, Setting, SettingGroup, SliderComponent} from "obsidian";
import KeyshotsPlugin from "../plugin";
import {Preset, PRESETS_INFO} from "../constants/Presets";
import DEFAULT_KEYSHOTS_SETTINGS from "../constants/DefaultKeyshotsSettings";
import type {
    CalloutCursorPosition,
    CalloutCursorPositionWithoutSelection
} from "../model/KeyshotsSettings";


function getOpenCommands(plugin: KeyshotsPlugin) {
    const cmds: Record<string, string> = {}
    Array.of("switcher", "omnisearch", "darlal-switcher-plus").forEach((pluginId) => {
        Object.values(plugin.app.commands.commands)
            .filter((v) => v.id.startsWith(pluginId))
            .forEach((v) => cmds[v.id] = v.name)
    })
    return cmds;
}

const DOUBLE_KEY_OPTIONS = {
    "Control": "Control",
    "Shift": "Shift",
    "Alt": "Alt"
} as const;

interface EnhancedSetting extends Setting {
    setMarkdownDesc(markdown: string): EnhancedSetting;
}

export class KeyshotsSettingTab extends PluginSettingTab {
    plugin: KeyshotsPlugin;
    icon = "keyshots";
    private component: Component = new Component()

    constructor(app: App, plugin: KeyshotsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    private addSettingGroup(cb: (group: SettingGroup) => void) {
        cb(new SettingGroup(this.containerEl))
    }

    private enhanceSetting(setting: Setting) {
        const enhancedSetting = setting as unknown as EnhancedSetting

        enhancedSetting.setMarkdownDesc = (markdown: string) => {
            const minIndentCount = Math.min(
                ...markdown
                    .split("\n")
                    .filter(v => v.trim()!=="")
                    .map(v => v.length - v.trimStart().length)
            )
            
            const fixedMarkdown = markdown
                .split("\n")
                .map(v => v.substring(minIndentCount))
                .join("\n")
                .replace(/(?<!\n)\n(?!\n)/g, ' ')

            void MarkdownRenderer.render(this.app, fixedMarkdown, enhancedSetting.descEl, "", this.component)
                .then(() => {
                    setting.descEl.querySelectorAll('p').forEach(p => {
                        p.setCssStyles({
                            marginBlockStart: "0",
                            marginBlockEnd: "0"
                        })
                    });
                });
            
            return enhancedSetting
        }

        return enhancedSetting
    }

    hide(): void {
        super.hide()
        this.component.unload()
    }

    display() {
        const {containerEl} = this;
        containerEl.classList.add("keyshots-settings")
        containerEl.empty()
        this.component.load()
        
        this.addSettingGroup(group => group
            .setHeading("⌨️ Default keys")
            .addSetting(setting => void this.enhanceSetting(setting)
                .setName("IDE keys mapping")
                .setMarkdownDesc(`
                    Change default hotkeys based on IDE, that you are comfortable with.

                    **❗This does not overwrite your custom Keyshots hotkeys configuration!**
                `)
                .addDropdown(cb => cb
                    .addOptions(Object.entries(PRESETS_INFO).reduce((acc: Record<string, string>, [id, presetInfo]) => {
                        acc[id] = presetInfo.name;
                        return acc;
                    }, {}))
                    .setValue(this.plugin.settings.ide_mappings)
                    .onChange(async (value) => {
                        await this.plugin.changePreset(value as Preset)
                    })
                )
            )
            .addSetting(setting => void this.enhanceSetting(setting)
                // eslint-disable-next-line obsidianmd/ui/sentence-case
                .setName("Default Keyshots hotkeys")
                .setMarkdownDesc(`
                    Sets default hotkeys for keyshots commands, that are not modified by IDE preset.
                    **❗If you select clear preset, this setting will be ignored!**
                `)
                .addToggle(cb => cb
                    .setValue(this.plugin.settings.keyshot_mappings)
                    .onChange(async (value) => {
                        this.plugin.settings.keyshot_mappings = value
                        this.plugin.loadCommands()
                        await this.plugin.saveSettings()
                    })
                )
            )
        )

        let slider: SliderComponent;

        this.addSettingGroup(group => group
            .setHeading("🔧 Commands settings")
            .addSetting(setting => void this.enhanceSetting(setting)
                .setName("Case sensitivity")
                .setMarkdownDesc(`
                    Determines if Keyshots commands should be case sensitive.
                    For toggling while editing text just simply use <kbd>Ctrl + Alt + I</kbd>
                    hotkey if you are using default Keyshots binding!
                `)
                .addToggle(cb => cb
                    .setValue(this.plugin.settings.case_sensitive)
                    .onChange(async (value) => {
                        this.plugin.settings.case_sensitive = value
                        await this.plugin.saveSettings()
                    })
                )
            )
            .addSetting(setting => void this.enhanceSetting(setting)
                .setName("Shuffle rounds amount")
                .setMarkdownDesc(`
                    Number of rounds that will \`Shuffle selected lines\` command take.
                    The more rounds it will take, the more random it will be!
                `)
                .addSlider(cb => {
                    slider = cb
                        .setValue(this.plugin.settings.shuffle_rounds_amount)
                        .setLimits(1, 50, 1)
                        .onChange(async (value) => {
                            this.plugin.settings.shuffle_rounds_amount = value
                            await this.plugin.saveSettings()
                        })
                })
                .addButton(cb => cb
                    .setIcon("refresh-ccw")
                    .setTooltip("Reset to default")
                    .onClick(async () => {
                        this.plugin.settings.shuffle_rounds_amount = DEFAULT_KEYSHOTS_SETTINGS.shuffle_rounds_amount
                        slider.setValue(DEFAULT_KEYSHOTS_SETTINGS.shuffle_rounds_amount)
                        await this.plugin.saveSettings()
                    })
                )
            )
        )

        this.addSettingGroup(group => group
            .setHeading("💬 Callout settings")
            .addSetting(setting => this.enhanceSetting(setting)
                .setName("Insert line break before callout")
                .setMarkdownDesc(`
                    Adds an extra line break before a callout inserted with the
                    \`Better insert callout\` command.
                `)
                .addToggle(cb => cb
                    .setValue(this.plugin.settings.callout_prepend_line_break)
                    .onChange(async (value) => {
                        this.plugin.settings.callout_prepend_line_break = value
                        await this.plugin.saveSettings()
                    })
                )
            )
            .addSetting(setting => this.enhanceSetting(setting)
                .setName("Cursor position with selected text")
                .setDesc("Choose where the cursor is placed when selected text is converted to a callout.")
                .addDropdown(cb => cb
                    .addOptions({
                        start: "Start of callout content",
                        end: "End of callout",
                        title: "Callout title",
                        below: "Line below callout"
                    })
                    .setValue(this.plugin.settings.callout_cursor_position_with_selection)
                    .onChange(async (value) => {
                        this.plugin.settings.callout_cursor_position_with_selection = value as CalloutCursorPosition
                        await this.plugin.saveSettings()
                    })
                )
            )
            .addSetting(setting => this.enhanceSetting(setting)
                .setName("Cursor position without selected text")
                .setDesc("Choose whether typing starts inside the callout or in its title.")
                .addDropdown(cb => cb
                    .addOptions({
                        content: "Inside callout",
                        title: "Callout title"
                    })
                    .setValue(this.plugin.settings.callout_cursor_position_without_selection)
                    .onChange(async (value) => {
                        this.plugin.settings.callout_cursor_position_without_selection = value as CalloutCursorPositionWithoutSelection
                        await this.plugin.saveSettings()
                    })
                )
            )
            .addSetting(setting => this.enhanceSetting(setting)
                .setName("Custom callout types list")
                .setMarkdownDesc(`
                    Adds new callout types defined by user separated by new line (<kbd>Enter</kbd>),
                    you can specify aliases as well on same line separated by comma (<kbd>,</kbd>).
                    These will be used in \`Better insert callout\` command to expand it's choice 
                    with user defined callouts.
                `)
                .addTextArea(cb => cb
                    .setValue(this.plugin.settings.callouts_list.join("\n"))
                    .onChange(async (v) => {
                        this.plugin.settings.callouts_list = v.split("\n")
                        await this.plugin.saveSettings()
                    })
                )
            )
        )

        let addCaretKeybinding: Setting | null = null;
        let searchEngineEl : Setting | null = null;
        let openSwitchKeybinding: Setting | null = null;
        let commandPaletteKeybinding: Setting | null = null;

        this.addSettingGroup(group => group
            .setHeading("🔧 JetBrains Features")
            .addSetting(setting => void this.enhanceSetting(setting)
                .setName("Show double key command activity in status bar")
                .setDesc("When toggled on, status bar icon will show up when any of double key command is enabled. It displays status of currently active double key command.")
                .addToggle(cb => cb
                    .setValue(this.plugin.settings.show_double_key_status_bar_item)
                    .onChange(async (newValue) => {
                        this.plugin.settings.show_double_key_status_bar_item = newValue
                        await this.plugin.saveSettings()
                        this.plugin.loadDoubleKeyCommands()
                    })
                )
            )
            .addSetting(setting => void this.enhanceSetting(setting)
                .setName("Double key caret adding shortcut")
                .setMarkdownDesc(`
                    Everytime when you press key twice and second one you'll hold, then when you press
                    <kbd>↓</kbd> or <kbd>↑</kbd> keys, Obsidian will add carets like will normaly do with
                    \`Add carets up/down\` command.
                `)
                .addToggle(cb => cb
                    .setValue(this.plugin.settings.enable_carets_via_double_key_cmd)
                    .onChange(async (value) => {
                        this.plugin.settings.enable_carets_via_double_key_cmd = value
                        await this.plugin.saveSettings()
                        addCaretKeybinding?.setDisabled(!value)
                        this.plugin.loadDoubleKeyCommands()
                    })
                )
            )
            .addSetting(setting => {
                addCaretKeybinding = this.enhanceSetting(setting)
                    .setClass("indent")
                    .setName("Keybinding")
                    .setDesc("Sets the modifier key for triggering caret placement using a double keypress.")
                    .setDisabled(!this.plugin.settings.enable_carets_via_double_key_cmd)
                    .addDropdown(cb => cb
                        .addOptions(DOUBLE_KEY_OPTIONS)
                        .setValue(this.plugin.settings.key_carets_via_double_key_cmd)
                        .onChange(async (value) => {
                            this.plugin.settings.key_carets_via_double_key_cmd = value
                            await this.plugin.saveSettings()
                            this.plugin.loadDoubleKeyCommands()
                        })
                    )
            })
            .addSetting(setting => { this.enhanceSetting(setting)
                .setName("Opening switch modal via double key shortcut")
                .setDesc("If you have any of switch engine selected, hitting key twice will select open switch modal window.")
                .addToggle(cb => cb
                    .setValue(this.plugin.settings.enable_quick_switch_via_double_key_cmd)
                    .onChange(async (value) => {
                        this.plugin.settings.enable_quick_switch_via_double_key_cmd = value
                        await this.plugin.saveSettings()
                        searchEngineEl?.setDisabled(!value)
                        openSwitchKeybinding?.setDisabled(!value)
                        this.plugin.loadDoubleKeyCommands()
                    })
                )
            })
            .addSetting(setting => {
                openSwitchKeybinding = this.enhanceSetting(setting)
                    .setClass("indent")
                    .setName("Keybinding")
                    .setDesc("Sets the modifier key for opening the switch modal with a double keypress.")
                    .setDisabled(!this.plugin.settings.enable_quick_switch_via_double_key_cmd)
                    .addDropdown(cb => cb
                        .addOptions(DOUBLE_KEY_OPTIONS)
                        .setValue(this.plugin.settings.key_quick_switch_via_double_key_cmd)
                        .onChange(async (value) => {
                            this.plugin.settings.key_quick_switch_via_double_key_cmd = value
                            await this.plugin.saveSettings()
                            this.plugin.loadDoubleKeyCommands()
                        })
                    )
            })
            .addSetting(setting => {
                searchEngineEl = this.enhanceSetting(setting)
                    .setName("Engine selection")
                    .setMarkdownDesc(`
                        Here you can select any of supported switch engines.

                        Currently supported: Quick switcher, [Omnisearch](https://obsidian.md/plugins?id=omnisearch), 
                        [Quick Switcher++](https://obsidian.md/plugins?id=darlal-switcher-plus)
                    `)
                    .setClass("indent")
                    .setDisabled(!this.plugin.settings.enable_quick_switch_via_double_key_cmd)
                    .addDropdown(cb => {
                        const cmds = getOpenCommands(this.plugin)
                        const currSetting = this.plugin.settings.open_file_command
                        // eslint-disable-next-line obsidianmd/ui/sentence-case
                        cb.addOption("","-- No engine selected --")
                        cb.addOptions(cmds)
                        cb.setValue(Object.keys(cmds).contains(currSetting) ? currSetting : "")
                        cb.onChange(async (value) => {
                            this.plugin.settings.open_file_command = value
                            await this.plugin.saveSettings()
                        })
                    })
            })
            .addSetting(setting => void this.enhanceSetting(setting)
                .setName("Opening command-palette via double key shortcut")
                .setDesc("If you have command-palette plugin enabled, hitting twice will open command palette window.")
                .addToggle(cb => cb
                    .setValue(this.plugin.settings.enable_command_palette_via_double_key_cmd)
                    .onChange(async (value) => {
                        this.plugin.settings.enable_command_palette_via_double_key_cmd = value
                        await this.plugin.saveSettings()
                        commandPaletteKeybinding?.setDisabled(!value)
                        this.plugin.loadDoubleKeyCommands()
                    })
                )
            )
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            .addSetting(setting => commandPaletteKeybinding = this.enhanceSetting(setting)
                    .setClass("indent")
                    .setName("Keybinding")
                    .setDesc("Sets the modifier key for opening the command palette with a double keypress.")
                    .setDisabled(!this.plugin.settings.enable_command_palette_via_double_key_cmd)
                    .addDropdown(cb => cb
                        .addOptions(DOUBLE_KEY_OPTIONS)
                        .setValue(this.plugin.settings.key_command_palette_via_double_key_cmd)
                        .onChange(async (value) => {
                            this.plugin.settings.key_command_palette_via_double_key_cmd = value
                            await this.plugin.saveSettings()
                            this.plugin.loadDoubleKeyCommands()
                        })
                    )
            )
        )
    }
}
