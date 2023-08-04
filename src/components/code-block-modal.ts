import {PRISM_LANGS, PrismLanguage} from "../mappings/prism-langs";
import KeyshotsPlugin from "../plugin";
import {CallbackFuzzySuggestModal} from "./abstract/callback-modal";

export default class CodeBlockModal extends CallbackFuzzySuggestModal<PrismLanguage> {

    constructor(plugin: KeyshotsPlugin, onSelectCallback: (item: PrismLanguage) => void) {
        super(plugin, onSelectCallback);
        this.limit = 1000;
        this.setPlaceholder("Choose a language that this code block will be written in...")
    }

    getItemText(item: PrismLanguage): string {
        return item.name;
    }

    getItems(): PrismLanguage[] {
        return PRISM_LANGS;
    }
}