import RegexModal, {BaseRegexData} from "../abstract/regex-modal";
import {Setting} from "obsidian";
import KeyshotsPlugin from "../../plugin";

interface ReplaceRegexData extends BaseRegexData {
    replacer: string
}

export default class RegexReplaceModal extends RegexModal<ReplaceRegexData> {

    private replacer: string

    private parseEscapes(str: string) {
        return str.replace(/\\n/g, "\n")
            .replace(/\\t/g, "\t")
            .replace(/\\f/g, "\f")
            .replace(/\\b/g, "\b");
    }

    public constructor(
        plugin: KeyshotsPlugin,
        editorContent: string,
        modalTitle: string,
        confirmCallback: (data: ReplaceRegexData) => void,
        matchesCountCallback: (data: BaseRegexData) => number
    ) {
        super(plugin, editorContent, modalTitle, confirmCallback, matchesCountCallback);
        this.replacer = this.plugin.settings.modal_regex_last_used_replacer
    }

    previewProcessor(content: string): string {
        const regex = this.getRegex();
        return regex ? content.replace(regex, this.parseEscapes(this.replacer)) : content;
    }

    buildData(): ReplaceRegexData {
        return <ReplaceRegexData>{
            pattern: this.getRegex(),
            replacer: this.parseEscapes(this.replacer),
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
                    this.plugin.setSetting("modal_regex_last_used_replacer", v)
                    this.updatePreview()
                })
            )
        this.addCaseSensitiveSetting();
        this.addSelectionOnlySetting();
        this.updateModalValidState()
    }
}