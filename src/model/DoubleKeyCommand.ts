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