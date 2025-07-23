import {Notice, SuggestModal} from "obsidian";
import KeyshotsPlugin from "../plugin";
import {createRoot, Root} from "react-dom/client";
import * as React from "react";
import PresetInfo from "../model/PresetInfo";
import {Preset, PRESETS_INFO} from "../constants/Presets";

export default class IDEPresetModal extends SuggestModal<PresetInfo> {

    private readonly plugin: KeyshotsPlugin
    private root: Root | null = null;

    constructor(plugin: KeyshotsPlugin) {
        super(plugin.app);
        this.plugin = plugin
        this.setPlaceholder("Choose one of these presets to use...")
    }

    getSuggestions(query: string): PresetInfo[] | Promise<PresetInfo[]> {
        return Object.values(PRESETS_INFO).filter(v => v.name.toLowerCase().includes(query.toLowerCase()));
    }

    async onChooseSuggestion(item: PresetInfo) {
        await this.plugin.changePreset((Object.keys(PRESETS_INFO) as Preset[]).filter(f => PRESETS_INFO[f] === item)[0])
        new Notice(`✅ Preset successfully changed to "${item.name}"!`)
    }

    renderSuggestion(value: PresetInfo, el: HTMLElement) {
        this.root = createRoot(el);
        this.root.render(
            <div style={{"display": "flex", "gap": "10px", "alignItems": "center"}}>
                <div style={{display: "flex"}} dangerouslySetInnerHTML={{__html: value.iconSvgContent}}/>
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