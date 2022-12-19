import { App, Editor, EditorPosition, EditorSelectionOrCaret, Plugin} from 'obsidian';


const isCaret = (sel: EditorSelectionOrCaret) => sel.anchor.ch === sel.head?.ch && sel.anchor.line === sel.head.line;

const fromToPos = (one: EditorPosition, two: EditorPosition): [EditorPosition, EditorPosition] => {
	if (one.line == two.line) return one.ch > two.ch ? [two, one] : [one, two]
	return one.line < two.line ? [one, two] : [two, one]
}
const expandLines = (editor: Editor, from: EditorPosition, to: EditorPosition) : [EditorPosition, EditorPosition] => {
	return [
		{ ch: 0, line: from.line },
		{ ch: editor.getLine(to.line).length, line: to.line }
	]
}
const flipBooleanSetting = (app: App, setting: string) => app.vault.setConfig(setting, !app.vault.getConfig(setting))

const replaceSelections = (editor: Editor, transformFct: (val: string) => string) => {
	editor.listSelections().filter(sel => !isCaret(sel)).forEach(sel => { 
		const [from, to] = fromToPos(sel.anchor, sel.head)
		editor.replaceRange(transformFct(editor.getRange(from,to)),from,to)
	})
}

function moveLine(editor: Editor, direction: number, border: number) {
	const newSelections: EditorSelectionOrCaret[] = []
	editor.listSelections().forEach(sel => {
		if (isCaret(sel)) {
			const pos = sel.anchor
			if (pos.line !== border) {
				const [txA, txB] = [editor.getLine(pos.line), editor.getLine(pos.line+direction)]
				editor.setLine(pos.line + direction,txA)
				editor.setLine(pos.line, txB)
				newSelections.push({ anchor: { line: sel.anchor.line + direction, ch: sel.anchor.ch } })
			}
			else newSelections.push(sel)
		}
		else {
			const [from, to] = fromToPos(sel.anchor,sel.head)
			const borderLine = direction < 0 ? from.line : to.line
			if (borderLine !== border) {
				const [lfrom, lto] = expandLines(editor,from,to)
				const [txA,txB] = [editor.getRange(lfrom,lto),editor.getLine(borderLine + direction)]
				if (direction > 0) {
					editor.setLine(borderLine + direction, txA)
					editor.replaceRange(txB, lfrom, lto)
				}
				else {
					editor.replaceRange(txB, lfrom, lto)
					editor.setLine(borderLine + direction, txA)
				}
				newSelections.push(
					{
						anchor: { ch: from.ch, line: from.line+direction},
						head: {ch: to.ch, line: to.line+direction}
					}
				)
			}
			else newSelections.push(sel)
		}
	})
	editor.setSelections(newSelections)
}
function jetBrainsDuplicate(editor:Editor) {
	const newSelections: EditorSelectionOrCaret[] = []
	editor.listSelections().forEach(sel => {
		if (isCaret(sel)) {
			const ln = sel.anchor.line
			const tx = editor.getLine(ln)
			editor.setLine(ln, tx + "\n" + tx)
			newSelections.push({ anchor: { line: sel.anchor.line + 1, ch: sel.anchor.ch } })
		}
		else {
			const [from, to] = fromToPos(sel.anchor,sel.head)
			const tx = editor.getRange(from, to)
			editor.replaceRange(tx, from, from)
			if (sel.anchor.line === sel.head.line) {
				newSelections.push({ anchor: to, head: { line: to.line, ch: to.ch + tx.length } })
			}
			else {
				newSelections.push({ anchor: to, head: { line: to.line+(to.line-from.line), ch: to.ch } })
			}
		}
	})
	editor.setSelections(newSelections)
}
function vscodeDuplicate(editor: Editor, direction: number) {
	const newSelections: EditorSelectionOrCaret[] = []
	editor.listSelections().forEach(sel => {
		if (isCaret(sel)) {
			const ln = sel.anchor.line
			const tx = editor.getLine(ln)
			editor.setLine(ln, tx + "\n" + tx)
			if (direction > 0) newSelections.push({ anchor: { line: sel.anchor.line + 1, ch: sel.anchor.ch } })
			else newSelections.push(sel)
		}
		else {
			const [from, to] = fromToPos(sel.anchor,sel.head)
			const [lfrom, lto] = expandLines(editor,from,to)
			const tx = editor.getRange(lfrom, lto)
			editor.replaceRange(tx + "\n" + tx, lfrom, lto)
			if (direction > 0) {
				newSelections.push({
					anchor: { ch: sel.anchor.ch, line: sel.anchor.line + (to.line - from.line + 1) },
					head: { ch: sel.head.ch, line: sel.head.line + (to.line - from.line + 1) }
				})
			}
			else newSelections.push(sel)
		}
	})
	editor.setSelections(newSelections)
}
function addCarets(editor: Editor, direction: number, border: number) {
	const newSelections: EditorSelectionOrCaret[] = editor.listSelections()
	const caretSelectsOnly = newSelections.filter(val => isCaret(val))
	if (caretSelectsOnly.length === 0) return;
	const last = caretSelectsOnly[direction > 0? caretSelectsOnly.length - 1 : 0]
	if (last.anchor.line === border) return;
	newSelections.push({ anchor: { ch: last.anchor.ch, line: last.anchor.line + direction } })
	editor.setSelections(newSelections)
	const scroll = { anchor: { ch: last.anchor.ch, line: last.anchor.line + direction*2 } }
	editor.scrollIntoView({from:scroll.anchor, to:scroll.anchor})
}
function convertSpacesUnderScores(editor: Editor) {
	editor.listSelections().filter(sel => !isCaret(sel)).forEach(sel => {
		const [from, to] = fromToPos(sel.anchor, sel.head)
		const tx = editor.getRange(from, to)
		const [underI, spaceI] = [tx.indexOf("_"), tx.indexOf(" ")]
		const replaceToUnder = (s:string) => s.replace(/ /gm, "_")
		const replaceToSpace = (s:string) => s.replace(/_/gm, " ")

		if (underI !== -1 || spaceI !== -1) {
			if (underI === -1) editor.replaceRange(replaceToUnder(tx),from,to)
			else if (spaceI === -1) editor.replaceRange(replaceToSpace(tx),from,to)
			else if (underI > spaceI) editor.replaceRange(replaceToUnder(tx),from,to)
			else editor.replaceRange(replaceToSpace(tx),from,to)
		}
	})
}
function insertLine(editor: Editor, direction: number) {
	const newSelections: EditorSelectionOrCaret[] = []
	const a = (ln: number) => {
		const tx = [editor.getLine(ln), "\n"]
		if (direction < 0) tx.reverse()
		editor.setLine(ln, tx.join(""))
		newSelections.push({anchor:{ch:0,line:ln+(direction > 0 ? direction : 0)}})
	}
	editor.listSelections().sort((a,b) => a.anchor.line - b.anchor.line).forEach((sel,index) => {
		if (isCaret(sel)) a(sel.anchor.line+index)
		else {
			const [from, to] = fromToPos(sel.anchor,sel.head)
			a((direction > 0 ? to.line : from.line) + index)
		}
	})
	editor.setSelections(newSelections)
}
function convertURI(editor: Editor) {
	replaceSelections(editor, (s) => {
		try {
			const decoded = decodeURI(s)
			if (decoded === s) throw new Error()
			return decoded;
		}
		catch { return encodeURI(s) }
	})
}

const titleCase = (s:string) => s.replace(/\w\S*/g,(txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase())

export default class KeyshotsPlugin extends Plugin {

	async onload() {
		/*
		========================================================================
			SETTINGS
		========================================================================
		*/
		this.addCommand({
			id: 'change-readable-length',
			name: "Change readable line length",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "R" }],
			callback: () => flipBooleanSetting(this.app,'readableLineLength')
		});
		this.addCommand({
			id: 'toggle-line-numbers',
			name: "Toggle line numbers",
			hotkeys: [{ modifiers: ["Mod", "Shift"], key: "L" }],
			callback: () => flipBooleanSetting(this.app,'showLineNumber')
		});
		/*
		========================================================================
			EDITOR MOVEMENT/ADD/REMOVE
		========================================================================
		*/
		this.addCommand({
			id: 'move-line-up',
			name: 'Move line up',
			hotkeys: [{ modifiers: ["Alt", "Shift"], key: "ArrowUp" }],
			editorCallback: (editor) => moveLine(editor, -1, 0)
		});
		this.addCommand({
			id: 'move-line-down',
			name: 'Move line down',
			hotkeys: [{ modifiers: ["Alt", "Shift"], key: "ArrowDown" }],
			editorCallback: (editor) => moveLine(editor, 1, editor.lineCount()-1)
		});
		this.addCommand({
			id: 'add-carets-up',
			name: 'Add caret cursors up',
			hotkeys: [{ modifiers: ["Alt", "Mod"], key: "ArrowUp" }],
			editorCallback: (editor) => addCarets(editor, -1, 0)
		});
		this.addCommand({
			id: 'add-carets-down',
			name: 'Add caret cursors down',
			hotkeys: [{ modifiers: ["Alt", "Mod"], key: "ArrowDown" }],
			editorCallback: (editor) => addCarets(editor, 1, editor.lineCount())
		});
		this.addCommand({
			id: 'duplicate-line-up',
			name: 'Duplicate line up (Visual Studio Code)',
			hotkeys: undefined,
			editorCallback: (editor) => vscodeDuplicate(editor, -1)
		});
		this.addCommand({
			id: 'duplicate-line-down',
			name: 'Duplicate line down (Visual Studio Code)',
			hotkeys: undefined,
			editorCallback: (editor) => vscodeDuplicate(editor, 1)
		});
		this.addCommand({
			id: 'duplicate-selection-or-line',
			name: 'Duplicate selection or line (JetBrains IDEs)',
			hotkeys: [{ modifiers: ["Mod"], key: "D" }],
			editorCallback: (editor) => jetBrainsDuplicate(editor)
		});
		this.addCommand({
			id: 'insert-line-below',
			name: "Insert line below",
			hotkeys: [{ modifiers: ["Shift"], key: "Enter" }],
			editorCallback: (editor) => insertLine(editor, 1)
		})
		this.addCommand({
			id: 'insert-line-above',
			name: "Insert line above",
			hotkeys: [{ modifiers: ["Shift","Mod"], key: "Enter" }],
			editorCallback: (editor) => insertLine(editor, -1)
		})
		this.addCommand({
			id: 'join-lines',
			name: "Join Lines",
			hotkeys: [{ modifiers: ["Shift", "Mod"], key: "j" }],
			editorCallback: (editor) => replaceSelections(editor,(s)=>s.replace(/\n/g,""))
		})
		/*
		========================================================================
			SELECTION TRANSFORMATIONS
		========================================================================
		*/
		this.addCommand({
			id: 'trim-selected-text',
			name: "Trim selected text",
			hotkeys: [{ modifiers: ["Alt"], key: "T" }],
			editorCallback: (editor) => replaceSelections(editor, (s) => s.trim())
		});
		this.addCommand({
			id: 'convert-spaces-to-underscores',
			name: "Convert selected text to spaces <=> underscores",
			hotkeys: [{ modifiers: ["Alt"], key: "-" }],
			editorCallback: (editor) => convertSpacesUnderScores(editor)
		});
		this.addCommand({
			id: 'encode-or-decode-uri',
			name: "Encode / Decode URI",
			hotkeys: [{ modifiers: ["Mod","Alt"], key: "u" }],
			editorCallback: (editor) => convertURI(editor)
		})
		this.addCommand({
			id: 'transform-to-lowercase',
			name: "Transform selection to lowercase",
			hotkeys: [{ modifiers: ["Alt"], key: "l" }],
			editorCallback: (editor) => replaceSelections(editor,(s)=>s.toLowerCase())
		})
		this.addCommand({
			id: 'transform-to-uppercase',
			name: "Transform selection to uppercase",
			hotkeys: [{ modifiers: ["Alt"], key: "u" }],
			editorCallback: (editor) => replaceSelections(editor,(s)=>s.toUpperCase())
		})
		this.addCommand({
			id: 'transform-to-titlecase',
			name: "Transform selection to titlecase (Capitalize)",
			hotkeys: [{ modifiers: ["Alt"], key: "c" }],
			editorCallback: (editor) => replaceSelections(editor, (s) => titleCase(s))
		})
	}
}
