import {Modal} from "obsidian";
import KeyshotsPlugin from "../../plugin";

export default abstract class CallbackModal<T> extends Modal {

    protected readonly confirmCallback: (data: T) => void
    protected readonly modalTitle: string
    protected readonly plugin: KeyshotsPlugin

    protected constructor(plugin: KeyshotsPlugin, modalTitle: string, confirmCallback: (data: T) => void) {
        super(plugin.app);
        this.confirmCallback = confirmCallback;
        this.modalTitle = modalTitle
        this.plugin = plugin
    }

    protected successClose(data: T) {
        this.close()
        this.confirmCallback(data)
    }

    onOpen() {
        super.onOpen();
        const {titleEl, modalTitle} = this;
        titleEl.createEl("h1", {"text": modalTitle})
    }

    onClose() {
        this.containerEl.empty()
    }
}