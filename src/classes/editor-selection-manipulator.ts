import {Editor, EditorPosition, EditorRange, EditorSelection} from "obsidian";
import EditorPositionManipulator from "./editor-position-manipulator";
import {JavaLikeObject} from "./java-like-object";

export default class EditorSelectionManipulator implements EditorSelection, JavaLikeObject<EditorSelectionManipulator> {

    anchor: EditorPositionManipulator
    head: EditorPositionManipulator
    private readonly editor: Editor
    private sizeChange = 0

    constructor(selection: EditorSelection, editor: Editor) {
        this.anchor = new EditorPositionManipulator(selection.anchor, editor)
        this.head = new EditorPositionManipulator(selection.head, editor)
        this.editor = editor
    }

    clone(): EditorSelectionManipulator {
        return new EditorSelectionManipulator({anchor: this.anchor.clone(), head: this.head.clone()}, this.editor)
    }

    equals(sel: EditorSelection) {
        return this.anchor.equals(sel.anchor) && this.head.equals(sel.head)
    }

    isCaret(): boolean {
        return this.anchor.ch === this.head.ch && this.anchor.line === this.head.line
    }

    isNormalized(): boolean {
        return !((this.isOneLine() && this.anchor.ch > this.head.ch) || this.anchor.line > this.head.line)
    }

    isOneLine(): boolean {
        return this.anchor.line === this.head.line
    }

    isOnSameLine(sel: EditorSelectionManipulator): boolean {
        return this.asNormalized().head.line === sel.asNormalized().anchor.line
    }

    normalize(): this {
        if (!this.isNormalized()) {
            const [tAnchor, tHead] = [this.anchor, this.head]
            this.anchor = tHead
            this.head = tAnchor
        }
        return this
    }

    asNormalized(): EditorSelectionManipulator {
        return this.clone().normalize()
    }

    expand(): this {
        this.anchor.ch = this.isNormalized() ? 0 : this.editor.getLine(this.anchor.line).length
        this.head.ch = this.isNormalized() ? this.editor.getLine(this.head.line).length : 0
        return this
    }

    asEditorRange(): EditorRange {
        return {from: this.anchor, to: this.head}
    }

    asFromToPoints(): [EditorPosition, EditorPosition] {
        const norm = this.asNormalized()
        return [norm.anchor, norm.head]
    }

    toEditorSelection(): EditorSelection {
        return {anchor: this.anchor, head: this.head}
    }

    moveLines(anchor: number, head?: number): this {
        this.anchor.line += anchor
        this.head.line += head ?? anchor
        return this
    }

    moveChars(anchor: number, head?: number): this {
        this.anchor = new EditorPositionManipulator(this.editor.offsetToPos(this.editor.posToOffset(this.anchor) + anchor), this.editor)
        this.head = new EditorPositionManipulator(this.editor.offsetToPos(this.editor.posToOffset(this.head) + (head ?? anchor)), this.editor)
        return this
    }

    setLines(anchor: number, head?: number): this {
        this.anchor.line = anchor
        this.head.line = head ?? anchor
        return this
    }

    setChars(anchor: number, head?: number): this {
        this.anchor.ch = anchor
        this.head.ch = head ?? anchor
        return this
    }

    getText(): string {
        return this.editor.getRange(...this.asFromToPoints())
    }

    replaceText(to: string, resize = false): this {
        this.sizeChange = to.length - this.getText().length
        this.editor.replaceRange(to, ...this.asFromToPoints())
        if (resize) this.moveChars(0, this.sizeChange)
        return this
    }

    selectWord(): this {
        if (this.isCaret()) {
            const txt = this.anchor.getLine()
            const postCh = (txt.substring(this.anchor.ch).match(/^[^ ()[\]{},;]+/i) ?? [""])[0].length
            const preCh = (txt.substring(0, this.anchor.ch).match(/[^ ()[\]{},;]+$/i) ?? [""])[0].length
            this.moveChars(-preCh, postCh)
        }
        return this
    }

    collapse(): this {
        if (!this.isCaret()) this.head = this.anchor.clone()
        return this;
    }

    get linesCount() {
        const norm = this.asNormalized()
        return norm.head.line - norm.anchor.line + 1
    }

    get replaceSizeChange() {
        return this.sizeChange
    }

    static listSelections(editor: Editor) {
        return editor.listSelections().map(s => new EditorSelectionManipulator(s, editor))
    }

    static documentStart(editor: Editor): EditorSelectionManipulator {
        return new EditorSelectionManipulator({
            anchor: EditorPositionManipulator.documentStart(editor),
            head: EditorPositionManipulator.documentStart(editor)
        }, editor)
    }
}