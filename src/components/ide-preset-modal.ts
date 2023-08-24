import {Notice, SuggestModal} from "obsidian";
import {IDE_LABELS, IDEInfo} from "../mappings/ide-info";
import KeyshotsPlugin from "../plugin";

export default class IDEPresetModal extends SuggestModal<IDEInfo>{

    private readonly plugin: KeyshotsPlugin

    constructor(plugin: KeyshotsPlugin) {
        super(plugin.app);
        this.plugin = plugin
        this.setPlaceholder("Choose one of these presets to use...")
    }

    getSuggestions(query: string): IDEInfo[] | Promise<IDEInfo[]> {
        return Object.values(IDE_LABELS).filter(v => v.name.toLowerCase().includes(query.toLowerCase()));
    }

    async onChooseSuggestion(item: IDEInfo, evt: MouseEvent | KeyboardEvent) {
        await this.plugin.changePreset(Object.keys(IDE_LABELS).filter(f => IDE_LABELS[f] === item)[0])
        new Notice(`✅ Preset successfully changed to "${item.name}"!`)
    }

    renderSuggestion(value: IDEInfo, el: HTMLElement) {
        el.setCssProps({"display":"flex","gap":"10px","align-items":"center"})
        el.innerHTML += value.svg_icon_content
        const desc = el.createEl("div")
        desc.createEl("div", { text: value.name })
        desc.createEl("small", { text: value.description }).setCssProps({"opacity":"0.8"})
    }
}