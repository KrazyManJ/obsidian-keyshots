import {Component, MarkdownRenderer} from "obsidian";
import KeyshotsPlugin from "../plugin";
import {CallbackSuggestModal} from "./abstract/callback-suggest-modal";

export default class CalloutPickerModal extends CallbackSuggestModal<string> {

    private static readonly ROOT_CALLOUTS: string[][] = [
        ["note"],
        ["abstract", "summary", "tldr"],
        ["info"],
        ["tip", "hint", "important"],
        ["success", "check", "done"],
        ["question", "help", "faq"],
        ["warning", "caution", "attention"],
        ["failure", "fail", "missing"],
        ["danger", "error"],
        ["bug"],
        ["example"],
        ["quote", "cite"]
    ]

    constructor(plugin: KeyshotsPlugin, onSelectCallback: (item: string) => void) {
        super(plugin, onSelectCallback);
        this.setPlaceholder("Select one of the callouts... (callouts are searchable by it's id or aliases)")
    }

    getSuggestions(query: string): string[] | Promise<string[]> {
        return CalloutPickerModal.ROOT_CALLOUTS
            .concat(
                this.plugin.settings.callouts_list
                    .filter(v => v.length > 0 && v.replace(/\s/g,'').length != 0)
                    .map(v => v.split(","))
            )
            .filter(ids => ids.filter(id => id.includes(query.toLowerCase())).length > 0)
            .map(ids => ids[0]);
    }

    renderSuggestion(value: string, el: HTMLElement) {
        MarkdownRenderer.renderMarkdown(`>[!${value}]`, el, "", new Component()).then(() => {
            const callout = el.childNodes.item(0) as HTMLElement
            callout.setCssProps({"margin": "0"})
        })
    }
}