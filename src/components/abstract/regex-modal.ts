import CallbackModal from "./callback-modal";
import {
    App,
    Component,
    MarkdownRenderer,
    Setting,
    TextComponent
} from "obsidian";


export interface BaseRegexData {
    readonly pattern: RegExp
    readonly only_selections: boolean
}

export default abstract class RegexModal<T extends BaseRegexData> extends CallbackModal<BaseRegexData>{

    protected editorContent: string

    protected pattern = ""
    protected case_sensitive: boolean
    protected only_selections: boolean

    protected optionsCtrEl: HTMLElement

    protected patternInput: TextComponent
    protected footer: Setting

    private previewEl: HTMLElement
    private preview: boolean

    private readonly matchesCountCallback: (data: BaseRegexData) => number

    protected constructor(
        app: App,
        editorContent: string,
        modalTitle: string,
        confirmCallback: (data: T) => void,
        matchesCountCallback: (data: BaseRegexData) => number
    ) {
        super(app, modalTitle, confirmCallback);
        this.editorContent = editorContent;
        this.matchesCountCallback = matchesCountCallback
    }

    public abstract previewProcessor(content: string): string;

    public abstract buildData(): T;

    public getRegex(): RegExp | undefined {
        if (this.pattern === "") return undefined
        try {
            return new RegExp(this.pattern, `gm${this.case_sensitive ? "" : "i"}`)
        } catch (SyntaxError) {
            return undefined
        }
    }

    protected updateModalValidState(){
        const regex = this.getRegex()
        this.updatePreview()
        if (!regex) {
            this.patternInput.inputEl.classList.add("invalid")
            this.footer.nameEl.classList.add("invalid")
            this.footer.setName(this.pattern === "" ? "Empty Pattern!" : "Invalid Pattern!")
            return;
        }
        this.patternInput.inputEl.classList.remove("invalid")
        this.footer.nameEl.classList.remove("invalid")
        this.footer.setName("Matches: "+this.matchesCountCallback({pattern: regex, only_selections: this.only_selections}))
    }

    protected updatePreview(){
        this.previewEl.empty();
        if (this.preview) {
            MarkdownRenderer.renderMarkdown(this.previewProcessor(this.editorContent), this.previewEl, "", new Component()).then();
            this.previewEl.classList.replace("raw","markdown-rendered")
        }
        else {
            const content = this.previewEl.createEl("div")
            content.innerHTML = this.previewProcessor(this.editorContent)
            this.previewEl.classList.replace("markdown-rendered","raw")
        }
    }

    protected addPatternInput(){
        new Setting(this.optionsCtrEl)
            .setName("Pattern")
            .setDesc("Regular Expression pattern to select text for action.")
            .addText(cb => this.patternInput = cb
                .setValue(this.pattern)
                .setPlaceholder("(.*)")
                .onChange(v => {
                    this.pattern = v
                    this.updateModalValidState()
                })
            );
    }

    protected addCaseSensitiveSetting() {
        new Setting(this.optionsCtrEl)
            .setName("Case sensitive")
            .setDesc("If should RegEx care about difference between capital or non-capital letters.")
            .addToggle(cb => cb
                .setValue(this.case_sensitive)
                .onChange(v => {
                    this.case_sensitive = v;
                    this.updateModalValidState();
                })
            );
    }

    protected addSelectionOnlySetting(){
        new Setting(this.optionsCtrEl)
            .setName("Apply on already made selections only")
            .setDesc("If regex should be applied only in current selections in the editor.")
            .setClass("last")
            .addToggle(cb => cb
                .setValue(this.only_selections)
                .onChange(v => {
                    this.only_selections = v;
                    this.updateModalValidState();
                })
            );
    }

    onOpen() {
        super.onOpen();
        const { containerEl, contentEl } = this;
        containerEl.classList.add("keyshots-regex")
        const dividerEl = contentEl.createEl("div","content-divider");
        this.optionsCtrEl = dividerEl.createEl("div", "options-ctr");
        const previewCtrEl = dividerEl.createEl("div", "preview-ctr")
        previewCtrEl.createEl("h2",{text:"Preview"})
        this.previewEl = previewCtrEl.createEl("div","preview markdown-rendered")
        new Setting(previewCtrEl)
            .setName("Preview mode")
            .addToggle(cb => cb
                .onChange(v => {
                    this.preview = v;
                    this.updatePreview();
                })
            )
        this.footer = new Setting(contentEl)
            .addButton(cb => cb
                .setCta()
                .setButtonText("Proceed")
                .onClick(() => {
                    const regex = this.getRegex();
                    if (regex) this.successClose({
                        pattern: regex,
                        only_selections: this.only_selections
                    })
                })
            )
        this.footer.nameEl.classList.add("matches")
    }
}