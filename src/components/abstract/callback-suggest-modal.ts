import {FuzzySuggestModal, SuggestModal} from "obsidian";
import KeyshotsPlugin from "../../plugin";

export abstract class CallbackSuggestModal<T> extends SuggestModal<T> {
    private readonly onSelectCallback
    protected readonly plugin

    protected constructor(plugin: KeyshotsPlugin, onSelectCallback: (item: T, evt: MouseEvent | KeyboardEvent) => void) {
        super(plugin.app);
        this.plugin = plugin
        this.onSelectCallback = onSelectCallback
    }

    onChooseSuggestion(item: T, evt: MouseEvent | KeyboardEvent) {
        this.onSelectCallback(item, evt)
    }
}

export abstract class CallbackFuzzySuggestModal<T> extends FuzzySuggestModal<T> {
    private readonly onSelectCallback

    protected constructor(plugin: KeyshotsPlugin, onSelectCallback: (item: T, evt: MouseEvent | KeyboardEvent) => void) {
        super(plugin.app);
        this.onSelectCallback = onSelectCallback
    }

    onChooseItem(item: T, evt: MouseEvent | KeyboardEvent) {
        this.onSelectCallback(item, evt)
    }
}