import {App, Modal} from "obsidian";

export default abstract class CallbackModal<T> extends Modal {

    protected readonly confirmCallback: (data: T) => void
    protected readonly modalTitle: string

    protected constructor(app: App, modalTitle: string, confirmCallback: (data: T) => void) {
        super(app);
        this.confirmCallback = confirmCallback;
        this.modalTitle = modalTitle
    }

    protected successClose(data: T){
        this.close()
        this.confirmCallback(data)
    }

    onOpen() {
        super.onOpen();
        const { titleEl, modalTitle } = this;
        titleEl.createEl("h1", {"text": modalTitle})
    }

    onClose() {
        this.containerEl.empty()
    }
}