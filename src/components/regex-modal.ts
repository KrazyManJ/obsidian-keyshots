import {App, Setting} from "obsidian";
import CallbackModal from "./abstract/callback-modal";

interface RegexActionData {
    regex: RegExp
    replacer: string
    only_selections: boolean
}

export default class RegexModal extends CallbackModal<RegexActionData>{



    constructor(app: App, modalTitle: string , confirmCallback: (data: RegexActionData) => void) {
        super(app, modalTitle, confirmCallback);
    }

    onOpen() {
        super.onOpen()
        const { contentEl, modalTitle } = this;
        const data = {
            regex: "",
            replacer: "",
            only_selections: false,
            case_sensitive: false
        }
        new Setting(contentEl)
            .setName("Regular Expression")
            .addText(cb => cb
                .setValue(data.regex)
                .onChange(v => data.regex = v)
            )
        new Setting(contentEl)
            .setName("Replacer")
            .addText(cb => cb
                .setValue(data.replacer)
                .onChange(v => data.replacer = v)
            )
        new Setting(contentEl)
            .setName("Case sensitive")
            .addToggle(cb => cb
                .setValue(data.case_sensitive)
                .onChange(v => data.case_sensitive = v)
            )
        new Setting(contentEl)
            .setName("Only already selected")
            .addToggle(cb => cb
                .setValue(data.only_selections)
                .onChange(v => data.only_selections = v)
            )
        new Setting(contentEl)
            .addButton(cb => cb
                .setCta()
                .setButtonText(modalTitle)
                .onClick(() => this.successClose({
                    regex: new RegExp(data.regex,`gm${data.case_sensitive ? "i" : ""}`),
                    replacer: data.replacer,
                    only_selections: data.only_selections
                }))
            )
    }

}