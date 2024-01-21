import KeyshotsPlugin from "../plugin";


export interface DoubleKeyCommand {
    id: string
    name: string
    key: string
    maxDelay: number

    /**
     * Called when last key is pressed
     */
    lastPressedCallback?: () => void
    /**
     * Called when another key is pressed while holding last key of `hotkeys` array
     */
    anotherKeyPressedCallback?: (ev: KeyboardEvent) => void
}

declare interface KeyRecord {
    key: string,
    timeStamp: number
}

export default class DoubleKeyRegistry {

    private readonly plugin: KeyshotsPlugin
    private readonly statusBarItem: HTMLElement

    private readonly cmds: Record<string, DoubleKeyCommand> = {}

    private cancelAction = false

    private lastReleasedKey?: KeyRecord = undefined
    private lastPressedKey?: string = undefined
    private activeCmdId?: string = undefined

    private setStatusBarState(commandName?: string) {
        this.statusBarItem.setText(commandName ? "🟩" : "🟨")
        this.statusBarItem.setAttr("aria-label", "Keyshots: " + (commandName
                ? `command "${commandName}" is active`
                : `no double-key command active`
        ))
    }

    constructor(plugin: KeyshotsPlugin) {
        this.plugin = plugin
        this.statusBarItem = this.plugin.addStatusBarItem()
        this.statusBarItem.setAttr("aria-label-position", "top")
        this.setStatusBarState()
        const elem = window


        this.plugin.registerDomEvent(elem, "keydown", (ev) => {
            if (Object.keys(this.cmds).length === 0) return;
            if (this.cancelAction) this.cancelAction = false
            const currCmd = this.activeCmdId ? this.cmds[this.activeCmdId] : undefined
            this.lastPressedKey = ev.key
            if (this.lastReleasedKey && !currCmd && this.lastReleasedKey.key === ev.key) {
                this.activeCmdId = Object.keys(this.cmds).filter(cmd => this.cmds[cmd].key === ev.key)[0]
                const currCmd = this.cmds[this.activeCmdId]
                if (Math.abs(ev.timeStamp - this.lastReleasedKey.timeStamp) > currCmd.maxDelay) {
                    this.activeCmdId = undefined
                    return
                }
                this.setStatusBarState(currCmd.name)
                if (currCmd.lastPressedCallback) currCmd.lastPressedCallback()
                if (!currCmd.anotherKeyPressedCallback) this.cancelCurrentCommand(true)
            } else if (currCmd && ev.key !== currCmd.key && currCmd.anotherKeyPressedCallback) currCmd.anotherKeyPressedCallback(ev)
            else if (this.lastReleasedKey && this.lastReleasedKey.key !== ev.key) this.cancelCurrentCommand()
        })
        this.plugin.registerDomEvent(elem, "keyup", (ev) => {
            if (Object.keys(this.cmds).length === 0) return;
            if (this.cancelAction) return
            if (this.lastPressedKey && this.lastPressedKey != ev.key && !this.activeCmdId) this.cancelCurrentCommand();
            const currCmd = this.activeCmdId ? this.cmds[this.activeCmdId] : undefined
            if (!currCmd && Object.values(this.cmds).map(c => c.key).includes(ev.key))
                this.lastReleasedKey = {key: ev.key, timeStamp: ev.timeStamp}
            else if (currCmd && currCmd.key === ev.key) this.cancelCurrentCommand(true)
        })
        this.plugin.registerDomEvent(elem, "mousedown", () => {
            if (Object.keys(this.cmds).length === 0) return;
            this.cancelCurrentCommand(true)
        })
    }

    private cancelCurrentCommand(ingoreNextKeyUp = false) {
        this.setStatusBarState()
        this.cancelAction = ingoreNextKeyUp
        this.activeCmdId = undefined
        this.lastReleasedKey = undefined
    }

    registerCommand(cmd: DoubleKeyCommand) {
        this.cmds[cmd.id] = cmd
        this.cancelCurrentCommand()
    }

    unregisterAllCommands() {
        this.cancelCurrentCommand(true)
        Object.keys(this.cmds).forEach((i) => delete this.cmds[i])
    }
}