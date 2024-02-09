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
    /**
     * Called when last key is released
     * @param interrupted state of situation, if another key was pressed while holding command key
     */
    lastReleasedCallback?: (interrupted: boolean) => void
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
    private lastPressedKey?: KeyRecord = undefined
    private activeCmdId?: string = undefined
    private pressedKeys: string[] = []

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

    constructor(plugin: KeyshotsPlugin) {
        this.plugin = plugin
        this.statusBarItem = this.plugin.addStatusBarItem()
        this.statusBarItem.setAttr("aria-label-position", "top")
        this.setStatusBarState()
        const elem = window


        this.plugin.registerDomEvent(elem, "keydown", (ev) => {
            if (Object.keys(this.cmds).length === 0) return;
            this.pressedKeys.push(ev.key);
            if (this.cancelAction) this.cancelAction = false
            const currCmd = this.activeCmdId ? this.cmds[this.activeCmdId] : undefined;
            if (currCmd && ev.key == currCmd.key && this.pressedKeys.includes(ev.key)) return;
            this.lastPressedKey = this.createKeyRecord(ev);
            if (this.lastReleasedKey && !currCmd && this.lastReleasedKey.key === ev.key) {
                this.activeCmdId = Object.keys(this.cmds).filter(cmd => this.cmds[cmd].key === ev.key)[0]
                const currCmd = this.cmds[this.activeCmdId]
                if (Math.abs(ev.timeStamp - this.lastReleasedKey.timeStamp) > currCmd.maxDelay) {
                    this.activeCmdId = undefined
                    return
                }
                if (currCmd.anotherKeyPressedCallback)
                    this.setStatusBarState(currCmd.name)
                if (currCmd.lastPressedCallback)
                    currCmd.lastPressedCallback()
            }
            else if (currCmd && ev.key !== currCmd.key && currCmd.anotherKeyPressedCallback)
                currCmd.anotherKeyPressedCallback(ev)
            else if (this.lastReleasedKey && this.lastReleasedKey.key !== ev.key)
                this.cancelCurrentCommand()
        },{})
        this.plugin.registerDomEvent(elem, "keyup", (ev) => {
            if (Object.keys(this.cmds).length === 0) return;
            this.pressedKeys.remove(ev.key);
            if (this.cancelAction) return;
            if (this.lastPressedKey?.key != ev.key && !this.activeCmdId) {
                this.cancelCurrentCommand();
                return;
            }
            const currCmd = this.activeCmdId ? this.cmds[this.activeCmdId] : undefined
            if (!currCmd && Object.values(this.cmds).map(c => c.key).includes(ev.key)) {
                this.lastReleasedKey = this.createKeyRecord(ev)
            }
            else if (currCmd && currCmd.key === ev.key) {
                if (
                    this.lastPressedKey
                    && Math.abs(ev.timeStamp - this.lastPressedKey.timeStamp) <= currCmd.maxDelay
                    && currCmd.lastReleasedCallback
                )
                    currCmd.lastReleasedCallback(this.lastPressedKey?.key != ev.key)
                this.cancelCurrentCommand(true)
            }
        })

        this.plugin.registerDomEvent(elem, "mousedown", () => {
            if (Object.keys(this.cmds).length === 0) return;
            this.cancelCurrentCommand(true)
        })

        this.plugin.app.workspace.on("editor-change", () => {
                if (Object.keys(this.cmds).length === 0) return;
                this.cancelCurrentCommand(true)
            }
        )
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