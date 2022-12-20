import { App, Editor, EditorPosition, EditorSelectionOrCaret, Plugin, PluginSettingTab, Setting, Hotkey} from 'obsidian';


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

function splitSelectedTextOnNewLine(editor: Editor) {
	const newSelections: EditorSelectionOrCaret[] = []
	let index = 0
	editor.listSelections().sort((a,b) => a.anchor.line - b.anchor.line).forEach(sel => {
		if (isCaret(sel)) newSelections.push(sel)
		else {
			const [from, to] = fromToPos(
				{ch:sel.anchor.ch,line:sel.anchor.line+index},
				{ch:sel.head.ch,line:sel.head.line+index}
			)
			const tx = editor.getRange(from, to)
			editor.replaceRange("\n" + tx + "\n", from, to)
			newSelections.push({
				anchor: { ch: 0, line:from.line+1 },
				head: { ch: editor.getLine(to.line+1).length, line:to.line+1 }
			})
			index += (tx.match(/\n/g) || []).length+1
		}
	})
	editor.setSelections(newSelections)
}

function sortSelectedLines(editor: Editor) {
	const newSelections: EditorSelectionOrCaret[] = []
	editor.listSelections().filter(f => !isCaret(f)).forEach(sel => {
		const [from, to] = expandLines(editor, ...fromToPos(sel.anchor, sel.head))
		console.log(editor.getRange(from, to).split("\n"))
		editor.replaceRange(
			editor.getRange(from, to).split("\n")
				.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
				.join("\n")
			, from, to)
		const [nFrom,nTo] = expandLines(editor,from,to)
		newSelections.push({anchor:nFrom,head:nTo})
	})
	editor.setSelections(newSelections)
}

interface KeyshotsSettings {
	ide_mappings: string;
}

const DEFAULT_SETTINGS: KeyshotsSettings = {
	ide_mappings: "vscode"
}

interface KeyshotsMap {
	toggle_readable_length?: Hotkey[]
	toggle_line_numbers?: Hotkey[]
	move_line_up?: Hotkey[]
	move_line_down?: Hotkey[]
	add_carets_up?: Hotkey[]
	add_carets_down?: Hotkey[]
	duplicate_line_up?: Hotkey[]
	duplicate_line_down?: Hotkey[]
	duplicate_selection_or_line?: Hotkey[]
	insert_line_below?: Hotkey[]
	insert_line_above?: Hotkey[]
	join_selected_lines?: Hotkey[]
	split_selections_on_new_line?: Hotkey[]
	trim_selections?: Hotkey[]
	transform_from_to_snake_case?: Hotkey[]
	encode_or_decode_uri?: Hotkey[]
	transform_selections_to_lowercase?: Hotkey[]
	transform_selections_to_uppercase?: Hotkey[]
	transform_selections_to_titlecase?: Hotkey[]
	sort_selected_lines?: Hotkey[]
}

const DEFAULT_MAP: KeyshotsMap = {
	toggle_readable_length: [{ modifiers: ["Mod", "Shift"], key: "R" }],
	toggle_line_numbers: [{ modifiers: ["Mod", "Shift"], key: "L" }],
	add_carets_up: [{ modifiers: ["Alt", "Mod"], key: "ArrowUp" }],
	add_carets_down: [{ modifiers: ["Alt", "Mod"], key: "ArrowDown" }],
	insert_line_below: [{ modifiers: ["Shift"], key: "Enter" }],
	insert_line_above: [{ modifiers: ["Shift", "Mod"], key: "Enter" }],
	join_selected_lines: [{ modifiers: ["Shift", "Mod"], key: "j" }],
	split_selections_on_new_line: [{ modifiers: ["Alt"], key: "s" }],
	trim_selections: [{ modifiers: ["Alt"], key: "T" }],
	transform_from_to_snake_case: [{ modifiers: ["Alt"], key: "-" }],
	encode_or_decode_uri: [{ modifiers: ["Mod", "Alt"], key: "u" }],
	transform_selections_to_lowercase: [{ modifiers: ["Alt"], key: "l" }],
	transform_selections_to_titlecase: [{ modifiers: ["Alt"], key: "c" }],
	transform_selections_to_uppercase: [{ modifiers: ["Alt"], key: "u" }],
	sort_selected_lines: [{ modifiers: ["Mod", "Shift"], key: "s" }],
}

const KEYSHOTS_MAPS: {[key: string]: KeyshotsMap} = {
	"vscode": Object.assign({}, DEFAULT_MAP, {
		move_line_up: [{ modifiers: ["Alt"], key: "ArrowUp" }],
		move_line_down: [{ modifiers: ["Alt"], key: "ArrowDown" }],
		duplicate_line_up: [{ modifiers: ["Alt", "Shift"], key: "ArrowUp" }],
		duplicate_line_down: [{ modifiers: ["Alt", "Shift"], key: "ArrowDown" }]
	}),
	"jetbrains":  Object.assign({}, DEFAULT_MAP, {
		move_line_up: [{ modifiers: ["Alt", "Shift"], key: "ArrowUp" }],
		move_line_down: [{ modifiers: ["Alt", "Shift"], key: "ArrowDown" }],
		duplicate_selection_or_line: [{ modifiers: ["Mod"], key: "D" }],
	})
}

export default class KeyshotsPlugin extends Plugin {

	command_ids: Set<string>
	settings: KeyshotsSettings

	async onload() {
		await this.loadSettings()
		this.addSettingTab(new KeyshotsSettingTab(this.app, this))
		this.loadCommands()
	}

	async loadCommands() {
		
		if (this.command_ids !== undefined) this.command_ids.forEach((a) => this.app.commands.removeCommand(a))
		

		const IDS: string[] = []
		const MAP: KeyshotsMap = KEYSHOTS_MAPS[this.settings.ide_mappings]
		IDS.push(
			/*
			========================================================================
				SETTINGS
			========================================================================
			*/
			this.addCommand({
				id: 'toggle-readable-length',
				name: "Toggle readable line length",
				hotkeys: MAP.toggle_readable_length,
				callback: () => flipBooleanSetting(this.app,'readableLineLength')
			}).id,
			this.addCommand({
				id: 'toggle-line-numbers',
				name: "Toggle line numbers",
				hotkeys: MAP.toggle_line_numbers,
				callback: () => flipBooleanSetting(this.app,'showLineNumber')
			}).id,
			/*
			========================================================================
				EDITOR MOVEMENT/ADD/REMOVE
			========================================================================
			*/
			this.addCommand({
				id: 'move-line-up',
				name: 'Move line up',
				hotkeys: MAP.move_line_up,
				editorCallback: (editor) => moveLine(editor, -1, 0)
			}).id,
			this.addCommand({
				id: 'move-line-down',
				name: 'Move line down',
				hotkeys: MAP.move_line_down,
				editorCallback: (editor) => moveLine(editor, 1, editor.lineCount()-1)
			}).id,
			this.addCommand({
				id: 'add-carets-up',
				name: 'Add caret cursor up',
				hotkeys: MAP.add_carets_up,
				editorCallback: (editor) => addCarets(editor, -1, 0)
			}).id,
			this.addCommand({
				id: 'add-carets-down',
				name: 'Add caret cursor down',
				hotkeys: MAP.add_carets_down,
				editorCallback: (editor) => addCarets(editor, 1, editor.lineCount())
			}).id,
			this.addCommand({
				id: 'duplicate-line-up',
				name: 'Duplicate line up (Visual Studio Code)',
				hotkeys: MAP.duplicate_line_up,
				editorCallback: (editor) => vscodeDuplicate(editor, -1)
			}).id,
			this.addCommand({
				id: 'duplicate-line-down',
				name: 'Duplicate line down (Visual Studio Code)',
				hotkeys: MAP.duplicate_line_down,
				editorCallback: (editor) => vscodeDuplicate(editor, 1)
			}).id,
			this.addCommand({
				id: 'duplicate-selection-or-line',
				name: 'Duplicate selection or line (JetBrains IDEs)',
				hotkeys: MAP.duplicate_selection_or_line,
				editorCallback: (editor) => jetBrainsDuplicate(editor)
			}).id,
			this.addCommand({
				id: 'insert-line-below',
				name: "Insert line below",
				hotkeys: MAP.insert_line_below,
				editorCallback: (editor) => insertLine(editor, 1)
			}).id,
			this.addCommand({
				id: 'insert-line-above',
				name: "Insert line above",
				hotkeys: MAP.insert_line_above,
				editorCallback: (editor) => insertLine(editor, -1)
			}).id,
			this.addCommand({
				id: 'join-selected-lines',
				name: "Join selected lines",
				hotkeys: MAP.join_selected_lines,
				editorCallback: (editor) => replaceSelections(editor, (s) => s.replace(/\n/g,""))
			}).id,
			this.addCommand({
				id: 'split-selections-on-new-line',
				name: "Split selections on new line",
				hotkeys: MAP.split_selections_on_new_line,
				editorCallback: (editor) => splitSelectedTextOnNewLine(editor)
			}).id,
			/*
			========================================================================
				SELECTION TRANSFORMATIONS
			========================================================================
			*/
			this.addCommand({
				id: 'trim-selections',
				name: "Trim selections",
				hotkeys: MAP.trim_selections,
				editorCallback: (editor) => replaceSelections(editor, (s) => s.trim())
			}).id,
			this.addCommand({
				id: 'transform-from-to-snake-case',
				name: "Transform selections from / to Snakecase",
				hotkeys: MAP.transform_from_to_snake_case,
				editorCallback: (editor) => convertSpacesUnderScores(editor)
			}).id,
			this.addCommand({
				id: 'encode-or-decode-uri',
				name: "Encode / Decode URI selections",
				hotkeys: MAP.encode_or_decode_uri,
				editorCallback: (editor) => convertURI(editor)
			}).id,
			this.addCommand({
				id: 'transform-selections-to-lowercase',
				name: "Transform selections to Lowercase",
				hotkeys: MAP.transform_selections_to_lowercase,
				editorCallback: (editor) => replaceSelections(editor, (s) => s.toLowerCase())
			}).id,
			this.addCommand({
				id: 'transform-selections-to-uppercase',
				name: "Transform selections to Uppercase",
				hotkeys: MAP.transform_selections_to_uppercase,
				editorCallback: (editor) => replaceSelections(editor, (s) => s.toUpperCase())
			}).id,
			this.addCommand({
				id: 'transform-selections-to-titlecase',
				name: "Transform selections to Titlecase (Capitalize)",
				hotkeys: MAP.transform_selections_to_titlecase,
				editorCallback: (editor) => replaceSelections(editor, (s) => titleCase(s))
			}).id,
			this.addCommand({
				id: 'sort-selected-lines',
				name: "Sort selected lines",
				hotkeys: MAP.sort_selected_lines,
				editorCallback: (editor) => sortSelectedLines(editor)
			}).id
		)
		this.command_ids = new Set(IDS);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class KeyshotsSettingTab extends PluginSettingTab {
	plugin: KeyshotsPlugin;

	constructor(app: App, plugin: KeyshotsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;
		containerEl.empty()
		containerEl.createEl('h1', { text: "Keyshots Settings" })
		new Setting(containerEl)
			.setName("IDE Keys Mapping")
			.setDesc("Change default hotkeys based on IDE, that you are comfortable with!")
			.addDropdown(cb => cb
				.addOption("vscode", "Visual Studio Code")
				.addOption("jetbrains", "JetBrains IDEs (IntelliJ IDEA, Pycharm, ... )")
				.setValue(this.plugin.settings.ide_mappings)
				.onChange(async (value) => {
					this.plugin.settings.ide_mappings = value
					await this.plugin.loadCommands()
					await this.plugin.saveSettings()
				})
			)
	}
}
