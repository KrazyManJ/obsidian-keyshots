import {Editor, MarkdownView, Plugin} from 'obsidian';
import {mapBySettings} from "./mappings";
import {DEFAULT_SETTINGS, KeyshotsSettings, KeyshotsSettingTab} from "./settings";
import {COMMANDS} from "./commands";
import * as functions from "./functions"
import {VerticalDirection} from "./utils";


export default class KeyshotsPlugin extends Plugin {

    private command_ids: Set<string>
    settings: KeyshotsSettings

    async onload() {
        await this.loadSettings()
        this.addSettingTab(new KeyshotsSettingTab(this.app, this))
        this.loadCommands()
        this.registerDoubleModCaret()
    }

    private registerDoubleModCaret(){
        let lastTimePressed: Date | undefined = undefined
        let ctrlActive = false;
        this.registerDomEvent(this.app.workspace.containerEl,"keydown",(ev) => {
            if (!["Control","ArrowUp","ArrowDown"].includes(ev.key)) return
            const view = this.app.workspace.getActiveViewOfType(MarkdownView)
            if (view === null) return
            const editor = view.editor
            if (ev.key === "Control"){

                if (lastTimePressed !== undefined && Math.abs(new Date().getTime() - lastTimePressed.getTime()) < 2000) ctrlActive = true
                else lastTimePressed = new Date()
                return
            }
            if (ctrlActive){
                functions.addCarets(
                    editor,
                    ev.key === "ArrowUp" ? VerticalDirection.UP : VerticalDirection.DOWN,
                    ev.key === "ArrowUp" ? 0 : editor?.lineCount()
                )
                ev.preventDefault()
            }
        })
        this.registerDomEvent(this.app.workspace.containerEl, "keyup", (ev) => {
            if (!["Control"].includes(ev.key)) return;
            if (this.app.workspace.getActiveViewOfType(MarkdownView) === null) return;
            ctrlActive = false;
        })
        this.registerEvent(app.workspace.on("active-leaf-change",() => ctrlActive = false))
    }

    loadCommands() {
        if (this.command_ids !== undefined) {
            this.command_ids.forEach(cmd => this.app.commands.removeCommand(cmd))
            this._events.splice(1)
        }
        this.command_ids = new Set(COMMANDS(this,mapBySettings(this)).map(cmd => this.addCommand(cmd).id));
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

