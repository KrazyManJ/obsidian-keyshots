import {Notice, SuggestModal} from "obsidian";
import {IDE_LABELS, IDEInfo} from "./mappings/ide-info";
import KeyshotsPlugin from "./main";

export default class LanguagePickerModal extends SuggestModal<IDEInfo>{

    private readonly plugin: KeyshotsPlugin

    constructor(plugin: KeyshotsPlugin) {
        super(plugin.app);
        this.plugin = plugin
    }

    getSuggestions(query: string): IDEInfo[] | Promise<IDEInfo[]> {
        return Object.values(IDE_LABELS).filter(v => v.name.toLowerCase().includes(query.toLowerCase()));
    }

    onChooseSuggestion(item: IDEInfo, evt: MouseEvent | KeyboardEvent) {
        this.plugin.settings.ide_mappings = Object.keys(IDE_LABELS).filter(f => IDE_LABELS[f] === item)[0]
        this.plugin.loadCommands()
        new Notice(`✅ Preset successfully changed to "${item.name}"!`)
        this.plugin.saveSettings()
    }

    renderSuggestion(value: IDEInfo, el: HTMLElement) {
        el.setCssProps({"display":"flex","gap":"10px","align-items":"center"})
        el.innerHTML += value.svg_icon_content
        const desc = el.createEl("div")
        desc.createEl("div", { text: value.name })
        desc.createEl("small", { text: value.description }).setCssProps({"opacity":"0.8"})
    }
}