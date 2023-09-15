import RegexModal, {BaseRegexData} from "../abstract/regex-modal";
import {App} from "obsidian";

export default class RegexSearchModal extends RegexModal<BaseRegexData> {


    public constructor(
        app: App,
        editorContent: string,
        modalTitle: string,
        confirmCallback: (data: BaseRegexData) => void,
        matchesCountCallback: (data: BaseRegexData) => number
    ) {
        super(app, editorContent, modalTitle, confirmCallback, matchesCountCallback);
    }

    previewProcessor(content: string): string {
        const regex = this.getRegex();
        return regex ? content.replace(regex, (match) => `<span class="keyshots-regex-match">${match}</span>`) : content;
    }

    buildData(): BaseRegexData {
        return <BaseRegexData>{
            pattern: this.getRegex(),
            only_selections: this.only_selections,
        }
    }

    onOpen() {
        super.onOpen();
        this.addPatternInput();
        this.addCaseSensitiveSetting();
        this.addSelectionOnlySetting();
        this.updateModalValidState()
    }
}