import {App, PluginSettingTab, Setting, SliderComponent} from "obsidian";
import KeyshotsPlugin from "../plugin";
import {DocumentFragmentBuilder} from "../classes/document-fragment-builder";
import {IDE_LABELS} from "../mappings/ide-info";
import {DEFAULT_SETTINGS} from "../settings";
import {KEYSHOTS_SVG} from "../svgs";

export class KeyshotsSettingTab extends PluginSettingTab {
    plugin: KeyshotsPlugin;

    constructor(app: App, plugin: KeyshotsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const {containerEl} = this;
        containerEl.empty()
        const title = containerEl.createEl('h1', {text: "Keyshots Settings"})
        title.innerHTML = KEYSHOTS_SVG(48) + title.innerHTML
        title.setCssProps({"display": "flex", "align-items": "center", "gap": "10px"})
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
                .addOptions(Object.entries(IDE_LABELS).reduce((acc: Record<string, string>, [key, ideInfo]) => {
                    acc[key] = ideInfo.name;
                    return acc;
                }, {}))
                .setValue(this.plugin.settings.ide_mappings)
                .onChange(async (value) => {
                    await this.plugin.changePreset(value)
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
                    this.plugin.loadCommands()
                    await this.plugin.saveSettings()
                })
            )
        containerEl.createEl('h2', {text: "🔧 Commands settings"})
        new Setting(containerEl)
            .setName("Case sensitivity")
            .setDesc(new DocumentFragmentBuilder()
                .appendText("Determines if Keyshots commands should be case sensitive. For toggling while editing text just simply use ")
                .createElem("kbd", {text: " Ctrl + Alt + I"})
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
        containerEl.createEl('h2', {text: "🔧 JetBrains Features"})
        new Setting(containerEl)
            .setName(new DocumentFragmentBuilder()
                .appendText("Double ")
                .createElem("kbd", {text: "Ctrl"})
                .appendText(" caret adding shortcut")
                .toFragment()
            )
            .setDesc(new DocumentFragmentBuilder()
                .appendText("Everytime when you press ")
                .createElem("kbd", {text: "Ctrl"})
                .appendText(" twice and second one you'll hold, then when you press ")
                .createElem("kbd", {text: "↓"})
                .appendText(" or ")
                .createElem("kbd", {text: "↑"})
                .appendText(" keys, Obsidian will add carets like will normaly do with \"")
                .createElem("b", {text: "Add carets up/down"})
                .appendText("\" command.")
                .toFragment()
            )
            .addToggle(cb => cb
                .setValue(this.plugin.settings.carets_via_double_ctrl)
                .onChange(async (value) => {
                    this.plugin.settings.carets_via_double_ctrl = value
                    await this.plugin.saveSettings()
                    this.plugin.loadDoubleKeyCommands()
                })
            )
        new Setting(containerEl)
            .setName(new DocumentFragmentBuilder()
                .appendText("Opening Quick-Switcher via double ")
                .createElem("kbd", {text: "Shift"})
                .appendText(" shortcut")
                .toFragment()
            )
            .setDesc(new DocumentFragmentBuilder()
                .appendText("If you have Quick Switcher plugin enabled, hitting ")
                .createElem("kbd", {text: "Shift"})
                .appendText(" twice will open quick switcher window.")
                .toFragment()
            )
            .addToggle(cb => cb
                .setValue(this.plugin.settings.quick_switch_via_double_shift)
                .onChange(async (value) => {
                    this.plugin.settings.quick_switch_via_double_shift = value
                    await this.plugin.saveSettings()
                    this.plugin.loadDoubleKeyCommands()
                })
            )
    }
}