import {FuzzySuggestModal} from "obsidian";
import {PRISM_LANGS, PrismLanguage} from "../mappings/prism-langs";
import KeyshotsPlugin from "../plugin";

export default class CodeBlockModal extends FuzzySuggestModal<PrismLanguage> {

    private readonly onSelectCallback: (item: PrismLanguage) => void

    constructor(plugin: KeyshotsPlugin, onSelectCallback: (item: PrismLanguage) => void) {
        super(plugin.app);
        this.limit = 1000;
        this.setPlaceholder("Choose a language that this code block will be written in...")
        this.onSelectCallback = onSelectCallback
    }

    getItemText(item: PrismLanguage): string {
        return item.name;
    }

    getItems(): PrismLanguage[] {
        return PRISM_LANGS;
    }

    onChooseItem(item: PrismLanguage, evt: MouseEvent | KeyboardEvent): void {
        this.onSelectCallback(item)
    }
}