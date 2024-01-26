import {Notice, SuggestModal} from "obsidian";
import {IDE_LABELS, IDEInfo} from "../mappings/ide-info";
import KeyshotsPlugin from "../plugin";
import {createRoot, Root} from "react-dom/client";
import * as React from "react";

export default class IDEPresetModal extends SuggestModal<IDEInfo> {

    private readonly plugin: KeyshotsPlugin
    private root: Root | null = null;

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