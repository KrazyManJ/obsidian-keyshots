import {Notice, SuggestModal} from "obsidian";
import KeyshotsPlugin from "../plugin";
import {createRoot, Root} from "react-dom/client";
import * as React from "react";
import {PresetInfo} from "../model/PresetInfo";
import {PresetsInfo} from "../constants/Presets";

export default class IDEPresetModal extends SuggestModal<PresetInfo> {

    private readonly plugin: KeyshotsPlugin
    private root: Root | null = null;

    constructor(plugin: KeyshotsPlugin) {
        super(plugin.app);
        this.plugin = plugin
        this.setPlaceholder("Choose one of these presets to use...")
    }

    getSuggestions(query: string): PresetInfo[] | Promise<PresetInfo[]> {
        return Object.values(PresetsInfo).filter(v => v.name.toLowerCase().includes(query.toLowerCase()));
    }

    async onChooseSuggestion(item: PresetInfo, evt: MouseEvent | KeyboardEvent) {
        await this.plugin.changePreset(Object.keys(PresetsInfo).filter(f => PresetsInfo[f] === item)[0])
        new Notice(`✅ Preset successfully changed to "${item.name}"!`)
    }

    renderSuggestion(value: PresetInfo, el: HTMLElement) {
        this.root = createRoot(el);
        this.root.render(
            <div style={{"display": "flex", "gap": "10px", "alignItems": "center"}}>
                <div style={{display: "flex"}} dangerouslySetInnerHTML={{__html: value.svg_icon_content}}/>
                <div>
                    <div>{value.name}</div>
                    <small style={{opacity: 0.8}}>{value.description}</small>
                </div>
            </div>
        )
    }

    onClose() {
        this.root?.unmount();
    }
}