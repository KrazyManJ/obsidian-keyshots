import {App, PluginSettingTab, Setting, SliderComponent} from "obsidian";
import {DocumentFragmentBuilder} from "./classes/document-fragment-builder";
import KeyshotsPlugin from "./main";

export const DEFAULT_SETTINGS: KeyshotsSettings = {
    ide_mappings: "clear",
    keyshot_mappings: true,
    case_sensitive: true,
    shuffle_rounds_amount: 10
}

export declare interface KeyshotsSettings {
    ide_mappings: string;
    keyshot_mappings: boolean;
    case_sensitive: boolean;
    shuffle_rounds_amount: number
}



export class KeyshotsSettingTab extends PluginSettingTab {
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