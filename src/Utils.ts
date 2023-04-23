import {Hotkey, Modifier} from "obsidian";

export const hotKey = (key: string, ...modifiers: Modifier[]): Hotkey[] => [{key: key, modifiers: modifiers}]

export interface Cloneable<T> {
    clone(): T
}

export enum VerticalDirection { UP = -1, DOWN = 1 }
