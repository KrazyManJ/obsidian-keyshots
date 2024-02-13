import {Editor, EditorPosition, EditorRange} from "obsidian";
import {JavaLikeObject} from "./java-like-object";

export default class EditorPositionManipulator implements EditorPosition, JavaLikeObject<EditorPositionManipulator> {

    ch: number
    line: number
    private readonly editor: Editor

    constructor(position: EditorPosition, editor: Editor) {
        this.ch = position.ch
        this.line = position.line
        this.editor = editor
    }

    clone(): EditorPositionManipulator {
        return new EditorPositionManipulator({ch: this.ch, line: this.line}, this.editor)
    }

    equals(pos: EditorPosition) {
        return this.line === pos.line && this.ch === pos.ch
    }

    asEditorRange(): EditorRange {
        return {from: this, to: this}
    }

    getLine(): string {
        return this.editor.getLine(this.line);
    }

    setLine(text: string): this {
        this.editor.setLine(this.line, text)
        return this
    }

    movePos(line: number, ch: number): this {
        this.line += line
        this.ch += ch
        return this
    }

    setPos(line: number, ch: number): this {
        this.line = line
        this.ch = ch
        return this
    }

    toOffset(): number {
        return this.editor.posToOffset(this)
    }

    static documentStart(editor: Editor): EditorPositionManipulator {
        return new EditorPositionManipulator({ch: 0, line: 0}, editor);
    }

    static mainCursor(editor: Editor): EditorPositionManipulator {
        return new EditorPositionManipulator(editor.getCursor(), editor);
    }
}