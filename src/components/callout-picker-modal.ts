import {Component, MarkdownRenderer, SuggestModal} from "obsidian";
import KeyshotsPlugin from "../plugin";

export default class CalloutPickerModal extends SuggestModal<string>{

    private static readonly CALLOUTS = ["note","abstract","info","tip","success","question","warning","failure","danger","bug","example","quote"]
    private readonly onSelectCallback

    constructor(plugin: KeyshotsPlugin, onSelectCallback: (item: string) => void) {
        super(plugin.app);
        this.onSelectCallback = onSelectCallback
    }

    getSuggestions(query: string): string[] | Promise<string[]> {
        return CalloutPickerModal.CALLOUTS.filter(id => id.includes(query));
    }

    onChooseSuggestion(item: string, evt: MouseEvent | KeyboardEvent) {
        this.onSelectCallback(item)
    }

    renderSuggestion(value: string, el: HTMLElement) {
        MarkdownRenderer.renderMarkdown(`>[!${value}]`, el, "", new Component()).then()
    }

}