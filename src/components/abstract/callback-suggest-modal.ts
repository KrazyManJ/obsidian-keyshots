import {Component, FuzzySuggestModal, SuggestModal} from "obsidian";
import KeyshotsPlugin from "../../plugin";

export abstract class CallbackSuggestModal<T> extends SuggestModal<T> {
    private readonly onSelectCallback: (item: T, evt: MouseEvent | KeyboardEvent) => void
    protected readonly plugin!: KeyshotsPlugin
    protected readonly component: Component = new Component()

    protected constructor(plugin: KeyshotsPlugin, onSelectCallback: (item: T, evt: MouseEvent | KeyboardEvent) => void) {
        super(plugin.app);
        this.plugin = plugin
        this.onSelectCallback = onSelectCallback
    }

    onChooseSuggestion(item: T, evt: MouseEvent | KeyboardEvent) {
        this.onSelectCallback(item, evt)
    }

    async onOpen() {
        await super.onOpen()
        this.component.onload()
    }

    onClose() {
        super.onClose()
        this.component.onunload()
    }
}

export abstract class CallbackFuzzySuggestModal<T> extends FuzzySuggestModal<T> {
    private readonly onSelectCallback: (item: T, evt: MouseEvent | KeyboardEvent) => void
    protected readonly component: Component = new Component()

    protected constructor(plugin: KeyshotsPlugin, onSelectCallback: (item: T, evt: MouseEvent | KeyboardEvent) => void) {
        super(plugin.app);
        this.onSelectCallback = onSelectCallback
    }

    onChooseItem(item: T, evt: MouseEvent | KeyboardEvent) {
        this.onSelectCallback(item, evt)
    }

    async onOpen() {
        await super.onOpen()
        this.component.onload()
    }

    onClose() {
        super.onClose()
        this.component.onunload()
    }
}