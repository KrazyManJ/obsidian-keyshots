import KeyshotsPlugin from "../plugin";
import DoubleKeyCommand from "../model/DoubleKeyCommand";
import { Command, Component, setIcon } from "obsidian";


declare interface KeyRecord {
    key: string,
    timeStamp: number
}

export default class DoubleKeyRegistry extends Component {

    private readonly plugin: KeyshotsPlugin
    private readonly statusBarItem: HTMLElement
    private readonly statusBarIcon: HTMLSpanElement

    private readonly cmds: Record<string, DoubleKeyCommand> = {}
    private app = app // To make app command code injection work

    private cancelAction = false

    private lastReleasedKey?: KeyRecord = undefined
    private lastPressedKey?: KeyRecord = undefined
    private activeCommands: DoubleKeyCommand[] = []

    private pressedKeys: Set<string> = new Set()

    private lastAction?: "lastPressed" | "anotherKeyPressed" | "lastReleased" = undefined


    private createKeyRecord(ev: KeyboardEvent): KeyRecord {
        return {
            key: ev.key,
            timeStamp: ev.timeStamp
        }
    }

    private setStatusBarState(commandName?: string) {
        this.statusBarItem.style.color = `var(--color-${commandName ? "green" : "orange"})`
        this.statusBarItem.setAttr("aria-label", "Keyshots: " + (commandName
                ? `command "${commandName}" is active`
                : `no double-key command active`
        ))
    }

    private originalExecuteCommand: (e: Command, t: unknown) => boolean

    private onKeyPress(ev: KeyboardEvent) {
        if (!this.hasAnyCommandRegistered) {
            return;
        }

        this.pressedKeys.add(ev.key);
        this.cancelAction = false
        if (this.activeCommands.length > 0 && ev.key == this.activeCommands[0].key && this.pressedKeys.has(ev.key)) {
            return;
        }
        this.lastPressedKey = this.createKeyRecord(ev);
        if (this.lastReleasedKey && this.activeCommands.length === 0 && this.lastReleasedKey.key === ev.key) {
            this.activeCommands = Object.values(this.cmds).filter(cmd => cmd.key === ev.key)
            
            this.activeCommands.forEach((activeCommand,i) => {
                if (this.lastReleasedKey && Math.abs(ev.timeStamp - this.lastReleasedKey.timeStamp) > activeCommand.maxDelay) {
                    delete this.activeCommands[i]
                }
            })
            const firstCommandWithAnotherKeyPressedCallback = this.activeCommands.find(activeCommand => {
                return activeCommand.anotherKeyPressedCallback
            })
            if (firstCommandWithAnotherKeyPressedCallback) {
                this.setStatusBarState(firstCommandWithAnotherKeyPressedCallback.name)
            }

            const firstCommandWithLastPressedCallback = this.activeCommands.find(activeCommand => {
                return activeCommand.lastPressedCallback
            })
            if (firstCommandWithLastPressedCallback && firstCommandWithLastPressedCallback.lastPressedCallback) {
                this.lastAction = 'lastPressed'
                firstCommandWithLastPressedCallback.lastPressedCallback()
                this.lastAction = undefined
            }
            return;
        }
        const firstCommandWithAnotherKeyPressedCallback = this.activeCommands.find(activeCommand => {
            return activeCommand.anotherKeyPressedCallback
        })
        if (firstCommandWithAnotherKeyPressedCallback && firstCommandWithAnotherKeyPressedCallback.anotherKeyPressedCallback){
            this.lastAction = 'anotherKeyPressed'
            firstCommandWithAnotherKeyPressedCallback.anotherKeyPressedCallback(ev)
            this.lastAction = undefined
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
        if (this.lastPressedKey?.key != ev.key && !this.activeCommands) {
            this.cancelCurrentCommand();
            return;
        }
        if (this.activeCommands.length === 0 && Object.values(this.cmds).map(c => c.key).includes(ev.key)) {
            this.lastReleasedKey = this.createKeyRecord(ev)
        }
        else if (this.activeCommands.length > 0 && this.activeCommands[0].key === ev.key) {
            const firstCommandWithLastReleasedCallback = this.activeCommands.find(activeCommand => {
                return activeCommand.lastReleasedCallback
            })
            if (
                firstCommandWithLastReleasedCallback
                && this.lastPressedKey
                && Math.abs(ev.timeStamp - this.lastPressedKey.timeStamp) <= firstCommandWithLastReleasedCallback.maxDelay
                && firstCommandWithLastReleasedCallback.lastReleasedCallback
            ) {
                this.lastAction = 'lastReleased'
                firstCommandWithLastReleasedCallback.lastReleasedCallback(this.lastPressedKey?.key != ev.key)
                this.lastAction = undefined
            }
            this.cancelCurrentCommand(true)
        }
    }

    private cancelCurrentCommand(ingoreNextKeyUp = false) {
        this.setStatusBarState()
        this.cancelAction = ingoreNextKeyUp
        this.activeCommands = []
        this.lastReleasedKey = undefined
        this.lastAction = undefined
    }

    constructor(plugin: KeyshotsPlugin) {
        super();
        this.plugin = plugin

        this.statusBarItem = this.plugin.addStatusBarItem()
        this.statusBarIcon = this.statusBarItem.createSpan({cls:"status-bar-item-icon"})
        setIcon(this.statusBarIcon,"keyboard")
        this.statusBarItem.setAttr("data-tooltip-position", "top")


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
            
            if (this.activeCommands.length > 0) {
                for (const activeCommand of this.activeCommands) {
                    const whitelist = activeCommand.whitelistedCommands ?? []
                    const actionMatchesCommand = (this.lastAction === 'anotherKeyPressed' && activeCommand.anotherKeyPressedCallback)
                    || (this.lastAction === 'lastPressed' && activeCommand.lastPressedCallback)
                    || (this.lastAction === 'lastReleased' && activeCommand.lastReleasedCallback)

                    if (actionMatchesCommand && !whitelist.includes(command.id)) {
                        return false;
                    }
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