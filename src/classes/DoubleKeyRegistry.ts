import KeyshotsPlugin from "../plugin";
import DoubleKeyCommand from "../model/DoubleKeyCommand";
import { Command, Component } from "obsidian";


declare interface KeyRecord {
    key: string,
    timeStamp: number
}

export default class DoubleKeyRegistry extends Component {

    private readonly plugin: KeyshotsPlugin
    private readonly statusBarItem: HTMLElement

    private readonly cmds: Record<string, DoubleKeyCommand> = {}
    private app = app // To make app command code injection work

    private cancelAction = false

    private lastReleasedKey?: KeyRecord = undefined
    private lastPressedKey?: KeyRecord = undefined
    private activeCmd?: DoubleKeyCommand = undefined
    private pressedKeys: Set<string> = new Set()

    private createKeyRecord(ev: KeyboardEvent): KeyRecord {
        return {
            key: ev.key,
            timeStamp: ev.timeStamp
        }
    }

    private setStatusBarState(commandName?: string) {
        this.statusBarItem.setText(commandName ? "🟩" : "🟨")
        this.statusBarItem.setAttr("aria-label", "Keyshots: " + (commandName
                ? `command "${commandName}" is active`
                : `no double-key command active`
        ))
    }

    private originalExecuteCommand: (e: Command, t: any) => boolean

    private onKeyPress(ev: KeyboardEvent) {
        if (!this.hasAnyCommandRegistered) {
            return;
        }

        this.pressedKeys.add(ev.key);
        this.cancelAction = false

        if (this.activeCmd && ev.key == this.activeCmd.key && this.pressedKeys.has(ev.key)) {
            return;
        }
        this.lastPressedKey = this.createKeyRecord(ev);
        if (this.lastReleasedKey && !this.activeCmd && this.lastReleasedKey.key === ev.key) {
            this.activeCmd = Object.values(this.cmds).filter(cmd => cmd.key === ev.key)[0]
            
            if (Math.abs(ev.timeStamp - this.lastReleasedKey.timeStamp) > this.activeCmd.maxDelay) {
                this.activeCmd = undefined
                return
            }
            if (this.activeCmd.anotherKeyPressedCallback) {
                this.setStatusBarState(this.activeCmd.name)
            }
            if (this.activeCmd.lastPressedCallback) {
                this.activeCmd.lastPressedCallback()
            }
        }
        else if (this.activeCmd && ev.key !== this.activeCmd.key && this.activeCmd.anotherKeyPressedCallback){
            this.activeCmd.anotherKeyPressedCallback(ev)
        }
        else if (this.lastReleasedKey && this.lastReleasedKey.key !== ev.key) {
            this.cancelCurrentCommand()
        }
    }
    
    private onKeyRelease(ev: KeyboardEvent) {
        if (!this.hasAnyCommandRegistered) {
            return;
        }
        this.pressedKeys.delete(ev.key);
        if (this.cancelAction) {
            return;
        }
        if (this.lastPressedKey?.key != ev.key && !this.activeCmd) {
            this.cancelCurrentCommand();
            return;
        }
        if (!this.activeCmd && Object.values(this.cmds).map(c => c.key).includes(ev.key)) {
            this.lastReleasedKey = this.createKeyRecord(ev)
        }
        else if (this.activeCmd && this.activeCmd.key === ev.key) {
            if (
                this.lastPressedKey
                && Math.abs(ev.timeStamp - this.lastPressedKey.timeStamp) <= this.activeCmd.maxDelay
                && this.activeCmd.lastReleasedCallback
            )
                this.activeCmd.lastReleasedCallback(this.lastPressedKey?.key != ev.key)
            this.cancelCurrentCommand(true)
        }
    }

    private cancelCurrentCommand(ingoreNextKeyUp = false) {
        this.setStatusBarState()
        this.cancelAction = ingoreNextKeyUp
        this.activeCmd = undefined
        this.lastReleasedKey = undefined
    }

    constructor(plugin: KeyshotsPlugin) {
        super();
        this.plugin = plugin
        this.statusBarItem = this.plugin.addStatusBarItem()
        this.statusBarItem.setAttr("aria-label-position", "top")
        this.setStatusBarState()
        const elem = window

        this.plugin.registerDomEvent(elem, "keydown", (ev) => this.onKeyPress(ev))

        this.plugin.registerDomEvent(elem, "keyup", (ev) => this.onKeyRelease(ev))

        this.plugin.registerDomEvent(elem, "mousedown", () => {
            if (!this.hasAnyCommandRegistered) return;
            this.cancelCurrentCommand(true)
        })
        
        this.plugin.app.workspace.on("editor-change", () => {
            if (!this.hasAnyCommandRegistered) return;
            this.cancelCurrentCommand(true)
        })
    }

    onload(): void {
        this.originalExecuteCommand = app.commands.executeCommand
        this.app.commands.executeCommand = (command,t) => {
            
            if (this.activeCmd) {
                const whitelist = this.activeCmd.whitelistedCommands ?? []
                if (!whitelist.includes(command.id)) {
                    return false;
                }
            }

            return this.originalExecuteCommand(command,t);
        }
    }
    
    onunload(): void {
        this.app.commands.executeCommand = this.originalExecuteCommand
    }

    public registerCommand(cmd: DoubleKeyCommand) {
        this.cmds[cmd.id] = cmd
        this.cancelCurrentCommand()
    }

    public unregisterAllCommands() {
        this.cancelCurrentCommand(true)
        Object.keys(this.cmds).forEach((i) => delete this.cmds[i])
    }

    public get hasAnyCommandRegistered() {
        return Object.keys(this.cmds).length !== 0
    }
}