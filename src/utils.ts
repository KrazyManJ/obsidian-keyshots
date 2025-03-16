import {Hotkey, Modifier} from "obsidian";


export const HotKey = (key: string, ...mods: Modifier[]): Hotkey => ({key: key, modifiers: mods})

export const satisfies = <T,>() => <U extends T>(u: U) => u;
