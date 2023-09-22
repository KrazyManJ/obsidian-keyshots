import RegexModal, {BaseRegexData} from "../abstract/regex-modal";
import {App, Setting} from "obsidian";

interface ReplaceRegexData extends BaseRegexData {
    replacer: string
}

export default class RegexReplaceModal extends RegexModal<ReplaceRegexData> {

    private replacer = ""

    public constructor(
        app: App,
        editorContent: string,
        modalTitle: string,
        confirmCallback: (data: ReplaceRegexData) => void,
        matchesCountCallback: (data: BaseRegexData) => number
    ) {
        super(app, editorContent, modalTitle, confirmCallback, matchesCountCallback);
    }

    previewProcessor(content: string): string {
        const regex = this.getRegex();
        return regex ? content.replace(regex,this.replacer) : content;
    }

    buildData(): ReplaceRegexData {
        return <ReplaceRegexData>{
            pattern: this.getRegex(),
            replacer: this.replacer,
            only_selections: this.only_selections
        }
    }

    onOpen() {
        super.onOpen();
        this.addPatternInput();
        new Setting(this.optionsCtrEl)
            .setName("Replacer")
            .setDesc("Text for replacement, can capture groups made by Pattern.")
            .addText(cb => cb
                .setValue(this.replacer)
                .setPlaceholder("$1")
                .onChange(v => {
                    this.replacer = v
                        .replace(/\\n/g,"\n")
                        .replace(/\\t/g,"\t")
                        .replace(/\\f/g,"\f")
                        .replace(/\\b/g,"\b")
                    this.updatePreview()
                })
            )
        this.addCaseSensitiveSetting();
        this.addSelectionOnlySetting();
        this.updateModalValidState()
    }
}