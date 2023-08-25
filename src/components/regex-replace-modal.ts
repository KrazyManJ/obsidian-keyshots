import {App, ButtonComponent, Setting, TextComponent} from "obsidian";
import CallbackModal from "./abstract/callback-modal";


interface RegexMatchCountData {
    pattern: RegExp
    only_selections: boolean
}

interface RegexReplaceData extends RegexMatchCountData {
    replacer: string
}

export default class RegexReplaceModal extends CallbackModal<RegexReplaceData> {

    onRegexChangeCallback: (data: RegexMatchCountData) => number

    constructor(app: App, modalTitle: string, confirmCallback: (data: RegexReplaceData) => void,
                onRegexChangeCallback: (data: RegexMatchCountData) => number) {
        super(app, modalTitle, confirmCallback);
        this.onRegexChangeCallback = onRegexChangeCallback
    }

    onOpen() {
        super.onOpen()
        const {containerEl, contentEl} = this;
        containerEl.classList.add("keyshots-regex-modal");
        const data = {
            pattern: "",
            replacer: "",
            only_selections: false,
            case_sensitive: false
        }
        const buildRegex = () => {
            if (data.pattern === "") return undefined
            try {
                return new RegExp(data.pattern, `gm${data.case_sensitive ? "" : "i"}`)
            } catch (SyntaxError) {
                return undefined
            }
        }
        const updateModalState = () => {
            const regex = buildRegex()
            updateTest()
            if (!regex) {
                patternInput.inputEl.classList.add("invalid")
                counter.nameEl.classList.add("invalid")
                counter.setName(data.pattern === "" ? "Empty Pattern!" : "Invalid Pattern!")
                button.setDisabled(true);
                return;
            }
            patternInput.inputEl.classList.remove("invalid")
            counter.nameEl.classList.remove("invalid")
            button.setDisabled(false)
            counter.setName(`Matches: ${this.onRegexChangeCallback({
                pattern: regex,
                only_selections: data.only_selections
            })}`)
        }
        let patternInput: TextComponent
        new Setting(contentEl)
            .setName("Pattern")
            .setDesc("Regular Expression pattern to select text for replacement.")
            .addText(cb => patternInput = cb
                .setValue(data.pattern)
                .setPlaceholder("(.*)")
                .onChange(v => {
                    data.pattern = v
                    updateModalState()
                })
            )
        new Setting(contentEl)
            .setName("Replacer")
            .setDesc("Text for replacement, can capture groups made by Pattern.")
            .addText(cb => cb
                .setValue(data.replacer)
                .setPlaceholder("$1")
                .onChange(v => {
                    data.replacer = v
                    updateTest()
                })
            )
        new Setting(contentEl)
            .setName("Case sensitive")
            .setDesc("If should RegEx care about difference between capital or non-capital letters.")
            .addToggle(cb => cb
                .setValue(data.case_sensitive)
                .onChange(v => {
                    data.case_sensitive = v
                    updateModalState()
                })
            )
        new Setting(contentEl)
            .setName("Replace in already made selections only")
            .setDesc("If replace action should be applied only in current selections in the editor.")
            .setClass("last")
            .addToggle(cb => cb
                .setValue(data.only_selections)
                .onChange(v => {
                    data.only_selections = v
                    updateModalState()
                })
            )
        contentEl.createEl("h2", {"text": "Testing"})
        const testEl = contentEl.createEl("div", "test")
        const testInput = testEl.createEl("textarea",{attr: {placeholder: "Write your test text here..."}})
        const testOutput = testEl.createEl("pre")
        const updateTest = () => {
            const regex = buildRegex()
            testOutput.textContent = regex ? testInput.value.replace(regex, data.replacer) : testInput.value
        }
        testInput.addEventListener("input",() => updateTest())

        let button: ButtonComponent;
        const counter = new Setting(contentEl)
            .addButton(cb => button = cb
                .setCta()
                .setButtonText("Replace")
                .onClick(() => {
                    const regex = buildRegex()
                    if (regex) this.successClose({
                        pattern: regex,
                        replacer: data.replacer,
                        only_selections: data.only_selections
                    })
                })
            )
        counter.nameEl.classList.add("matches")
        updateModalState()
    }
}