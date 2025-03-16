import {App, PluginSettingTab, Setting, SliderComponent} from "obsidian";
import KeyshotsPlugin from "../plugin";
import DocumentFragmentBuilder from "../classes/DocumentFragmentBuilder";
import {KEYSHOTS_SVG} from "../constants/SVGs";
import {Preset, PRESETS_INFO} from "../constants/Presets";
import DEFAULT_KEYSHOTS_SETTINGS from "../constants/DefaultKeyshotsSettings";


function getOpenCommands() {
    const cmds: Record<string, string> = {}
    Array.of("switcher", "omnisearch", "darlal-switcher-plus").forEach((pluginId) => {
        Object.values(app.commands.commands)
            .filter((v) => v.id.startsWith(pluginId))
            .forEach((v) => cmds[v.id] = v.name)
    })
    return cmds;
}

export class KeyshotsSettingTab extends PluginSettingTab {
    plugin: KeyshotsPlugin;

    constructor(app: App, plugin: KeyshotsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const {containerEl} = this;
        containerEl.classList.add("keyshots-settings")
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
                .addOptions(Object.entries(PRESETS_INFO).reduce((acc: Record<string, string>, [id, presetInfo]) => {
                    acc[id] = presetInfo.name;
                    return acc;
                }, {}))
                .setValue(this.plugin.settings.ide_mappings)
                .onChange(async (value) => {
                    await this.plugin.changePreset(value as Preset)
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
                    this.plugin.settings.shuffle_rounds_amount = DEFAULT_KEYSHOTS_SETTINGS.shuffle_rounds_amount
                    slider.setValue(DEFAULT_KEYSHOTS_SETTINGS.shuffle_rounds_amount)
                    await this.plugin.saveSettings()
                })
            )
        new Setting(containerEl)
            .setName("Custom callout types list")
            .setDesc(
                new DocumentFragmentBuilder()
                    .appendText("Adds new callout types defined by user separated by new line (")
                    .createElem("kbd", {text: "Enter"})
                    .appendText("), you can specify aliases as well on same line separated by comma ( ")
                    .createElem("kbd", {text: ","})
                    .appendText(" ). These will be used in ")
                    .createElem("code", {text: "Better insert callout"})
                    .appendText(" command to expand it's choice with user defined callouts.")
                    .toFragment()
            )
            .addTextArea(cb => cb
                .setValue(this.plugin.settings.callouts_list.join("\n"))
                .onChange(async (v) => {
                    this.plugin.settings.callouts_list = v.split("\n")
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
        let searchEngineEl : Setting | null = null;
        new Setting(containerEl)
            .setName(new DocumentFragmentBuilder()
                .appendText("Opening switch modal via double ")
                .createElem("kbd", {text: "Shift"})
                .appendText(" shortcut")
                .toFragment()
            )
            .setDesc(new DocumentFragmentBuilder()
                .appendText("If you have any of switch engine selected, hitting ")
                .createElem("kbd", {text: "Shift"})
                .appendText(" twice will select open switch modal window.")
                .toFragment()
            )
            .addToggle(cb => cb
                .setValue(this.plugin.settings.quick_switch_via_double_shift)
                .onChange(async (value) => {
                    this.plugin.settings.quick_switch_via_double_shift = value
                    await this.plugin.saveSettings()
                    searchEngineEl?.setDisabled(!value)
                    this.plugin.loadDoubleKeyCommands()
                })
            )
        searchEngineEl = new Setting(containerEl)
            .setName(new DocumentFragmentBuilder()
                .appendText("Switch engine for double ")
                .createElem("kbd", {text: "Shift"})
                .appendText(" shortcut")
                .toFragment()
            )
            .setDesc(new DocumentFragmentBuilder()
                .appendText("Here you can select any of supported switch engines.")
                .createElem("br")
                .appendText("Currently supported: Quick switcher, ")
                .createElem("a",{text:"Omnisearch",href:"https://obsidian.md/plugins?id=omnisearch"})
                .appendText(", ")
                .createElem("a",{text:"Quick Switcher++",href:"https://obsidian.md/plugins?id=darlal-switcher-plus"})
                .appendText(".")
                .toFragment()
            )
            .setClass("indent")
            .addDropdown(cb => {
                const cmds = getOpenCommands()
                const currSetting = this.plugin.settings.open_file_command
                cb.addOption("","-- No engine selected --")
                cb.addOptions(cmds)
                cb.setValue(Object.keys(cmds).contains(currSetting) ? currSetting : "")
                cb.onChange(async (value) => {
                    this.plugin.settings.open_file_command = value
                    await this.plugin.saveSettings()
                })
            })

        if (!this.plugin.settings.quick_switch_via_double_shift) {
            searchEngineEl.setDisabled(true)
        }
        new Setting(containerEl)
            .setName(new DocumentFragmentBuilder()
                .appendText("Opening Command-Palette via double ")
                .createElem("kbd", {text: "Ctrl"})
                .appendText(" shortcut")
                .toFragment()
            )
            .setDesc(new DocumentFragmentBuilder()
                .appendText("If you have Command Palette plugin enabled, hitting ")
                .createElem("kbd", {text: "Ctrl"})
                .appendText(" twice will open command palette window.")
                .toFragment()
            )
            .addToggle(cb => cb
                .setValue(this.plugin.settings.command_palette_via_double_ctrl)
                .onChange(async (value) => {
                    this.plugin.settings.command_palette_via_double_ctrl = value
                    await this.plugin.saveSettings()
                    this.plugin.loadDoubleKeyCommands()
                })
            )
    }
}