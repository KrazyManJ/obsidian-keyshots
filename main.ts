import { App, Editor, EditorPosition, VaultConfig, Plugin, PluginSettingTab, Setting, Hotkey, EditorSelection, EditorRange, EditorCommandName, EditorTransaction} from 'obsidian';

/*
========================================================================
	NON-API TYPING
========================================================================
*/
declare module 'obsidian' {
	interface VaultConfig {
		readableLineLength: boolean
		showLineNumber: boolean
		livePreview: boolean
		showInlineTitle: boolean
	}
	interface Vault {
		getConfig<T extends keyof VaultConfig>(config: T): VaultConfig[T];
		setConfig<T extends keyof VaultConfig>(config: T, value: VaultConfig[T]): void;
	}
	interface CommandManager {
		removeCommand(id: string): void;
	}
	interface App {
		commands: CommandManager
	}
}

enum VerticalDirection { UP = -1, DOWN = 1 }


const isCaret = (sel: EditorSelection) => sel.anchor.ch === sel.head?.ch && sel.anchor.line === sel.head.line;
const isSelection = (sel: EditorSelection) => !isCaret(sel)

const normalizeSelection = (sel: EditorSelection): EditorSelection => {
	if (sel.anchor.line == sel.head.line) 
	return sel.anchor.ch > sel.head.ch ? {anchor: sel.head, head: sel.anchor} : {anchor: sel.anchor, head: sel.head}
	return sel.anchor.line < sel.head.line ? {anchor: sel.anchor, head: sel.head} : {anchor: sel.head, head: sel.anchor}
}

const selToPos = (sel: EditorSelection):[EditorPosition,EditorPosition] => [sel.anchor, sel.head]
const posToSel = (anchor: EditorPosition, head: EditorPosition):EditorSelection => { return {anchor: anchor, head: head} }
const getRangeSel = (editor: Editor, sel: EditorSelection):string => editor.getRange(...selToPos(normalizeSelection(sel)))
const rangeToSelection = (range: EditorRange): EditorSelection => { return {anchor: range.from, head: range.to} }
const selectionToRange = (range: EditorSelection): EditorRange => { return {from: range.anchor, to: range.head} }

const expandSelection = (editor: Editor, sel: EditorSelection) : EditorSelection => {
	sel = normalizeSelection(sel)
	return {
		anchor: { ch: 0, line: sel.anchor.line },
		head: { ch: editor.getLine(sel.head.line).length, line: sel.head.line }
	}
}
const flipBooleanSetting = (app: App, setting: keyof VaultConfig) => app.vault.setConfig(setting, !app.vault.getConfig(setting))

const replaceSelections = (editor: Editor, transformFct: (val: string) => string) => {
	editor.listSelections().filter(isSelection).forEach(sel => { 
		const { anchor:from, head:to } = normalizeSelection(sel)
		editor.replaceRange(transformFct(editor.getRange(from,to)),from,to)
	})
}

const selectionsProcessor = (
	editor: Editor,
	arrCallback: ((arr: EditorSelection[]) => EditorSelection[]) | undefined,
	fct: (sel: EditorSelection, index: number) => EditorSelection
) => {
	const newSelections: EditorSelection[] = [];
	(arrCallback !== undefined 
		? arrCallback(editor.listSelections()) : editor.listSelections())
		.forEach((sel, index) => newSelections.push(fct(sel, index)))
	editor.setSelections(newSelections)
}

const selectionsEqual = (one: EditorSelection, two: EditorSelection) => {
	return one.anchor.ch === two.anchor.ch 
	&& one.anchor.line === two.anchor.line
	&& one.head.line === two.head.line
	&& one.head.ch === two.head.ch
}

function moveLine(editor: Editor, direction: VerticalDirection, border: number){
	selectionsProcessor(editor, undefined, (sel) => {
		const normSel = normalizeSelection(sel)
		if (direction === 1 ? normSel.head.line === border : normSel.anchor.line === border) return sel
		const { anchor: from, head: to} = expandSelection(editor,{
			anchor: { line: normSel.anchor.line+(direction === -1 ? direction : 0) , ch: normSel.anchor.ch },
			head: { line: normSel.head.line+(direction === 1 ? direction : 0) , ch: normSel.head.ch }
		})
		const tx = editor.getRange(from,to)
		if (isCaret(sel)) editor.replaceRange(tx.split("\n").reverse().join("\n"),from,to)
		else {
			const pieces = [
				tx.split("\n").slice(...(direction === 1 ? [-1] : [0,1]))[0],
				tx.split("\n").slice(...(direction === 1 ? [undefined,-1] : [1])).join("\n")
			]
			if (direction === -1) pieces.reverse()
			editor.replaceRange(pieces.join("\n"),from,to)
		}
		return {
			anchor: {line: sel.anchor.line+direction, ch: sel.anchor.ch},
			head: {line: sel.head.line+direction, ch: sel.head.ch}
		}
	})
}
function jetBrainsDuplicate(editor:Editor) {
	selectionsProcessor(editor, undefined, (sel) => {
		if (isCaret(sel)) {
			const ln = sel.anchor.line
			const tx = editor.getLine(ln)
			editor.setLine(ln, tx + "\n" + tx)
			return { 
				anchor: { line: sel.anchor.line + 1, ch: sel.anchor.ch },
				head: { line: sel.anchor.line + 1, ch: sel.anchor.ch }
			}
		}
		else {
			const {anchor:from, head:to} = normalizeSelection(sel)
			const tx = editor.getRange(from, to)
			editor.replaceRange(tx, from, from)
			return { anchor: to, head: editor.offsetToPos(editor.posToOffset(to)+tx.length)}
		}
	})
}
function vscodeDuplicate(editor: Editor, direction: VerticalDirection) {
	selectionsProcessor(editor, undefined, (sel) => {
		if (isCaret(sel)) {
			const ln = sel.anchor.line
			const tx = editor.getLine(ln)
			editor.setLine(ln, tx + "\n" + tx)
			if (direction > 0) return { 
				anchor: { line: sel.anchor.line + 1, ch: sel.anchor.ch },
				head: { line: sel.anchor.line + 1, ch: sel.anchor.ch }
			}
		}
		else {
			const {anchor:from, head:to} = normalizeSelection(sel)
			const {anchor:lfrom, head:lto} = expandSelection(editor,normalizeSelection(sel))
			const tx = editor.getRange(lfrom, lto)
			editor.replaceRange(tx + "\n" + tx, lfrom, lto)
			if (direction > 0) {
				return {
					anchor: { ch: sel.anchor.ch, line: sel.anchor.line + (to.line - from.line + 1) },
					head: { ch: sel.head.ch, line: sel.head.line + (to.line - from.line + 1) }
				}
			}
		}
		return sel
	})
}
function addCarets(editor: Editor, direction: VerticalDirection, border: number) {
	const newSelections: EditorSelection[] = editor.listSelections()
	const caretSelectsOnly = newSelections.filter(val => isCaret(val))
	if (caretSelectsOnly.length === 0) return;
	const last = caretSelectsOnly[direction > 0? caretSelectsOnly.length - 1 : 0]
	if (last.anchor.line === border) return;
	newSelections.push({ 
		anchor: { ch: last.anchor.ch, line: last.anchor.line + direction },
		head: { ch: last.anchor.ch, line: last.anchor.line + direction }
	})
	editor.setSelections(newSelections)
	const scroll = { anchor: { ch: last.anchor.ch, line: last.anchor.line + direction*2 } }
	editor.scrollIntoView({from:scroll.anchor, to:scroll.anchor})
}
function convertSpacesUnderScores(editor: Editor) {
	replaceSelections(editor, (tx) => {
		const [underI, spaceI] = [tx.indexOf("_"), tx.indexOf(" ")]
		const replaceToUnder = (s:string) => s.replace(/ /gm, "_")
		const replaceToSpace = (s:string) => s.replace(/_/gm, " ")
		if (underI !== -1 || spaceI !== -1) return tx
		if (underI === -1) return replaceToUnder(tx)
		if (spaceI === -1) return replaceToSpace(tx)
		if (underI > spaceI) return replaceToUnder(tx)
		return replaceToSpace(tx)
	})
}
function insertLine(editor: Editor, direction: VerticalDirection) {
	selectionsProcessor(editor, (s) => s.sort((a, b) => a.anchor.line - b.anchor.line), (sel, index) => {
		const a = (ln: number) => {
			const tx = [editor.getLine(ln), "\n"]
			if (direction < 0) tx.reverse()
			editor.setLine(ln, tx.join(""))
			return {
				anchor:{ch:0,line:ln+(direction > 0 ? direction : 0)},
				head:{ch:0,line:ln+(direction > 0 ? direction : 0)},
			}
		}
		if (isCaret(sel)) return a(sel.anchor.line+index)
		else {
			const {anchor:from, head:to} = normalizeSelection(sel)
			return a((direction > 0 ? to.line : from.line) + index)
		}
	})
}
const convertURI = (editor: Editor) => {
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
	let index = 0
	selectionsProcessor(editor, arr => arr.sort((a,b) => a.anchor.line - b.anchor.line), sel => {
		if (isCaret(sel)) return sel
		else {
			const {anchor:from, head:to} = normalizeSelection({
				anchor: {ch:sel.anchor.ch,line:sel.anchor.line+index},
				head: {ch:sel.head.ch,line:sel.head.line+index}
			})
			const tx = editor.getRange(from, to)
			editor.replaceRange("\n" + tx + "\n", from, to)
			index += (tx.match(/\n/g) || []).length+1
			return {
				anchor: { ch: 0, line: from.line + 1 },
				head: { ch: editor.getLine(to.line + 1).length, line: to.line + 1 }
			}
		}
	})
}

function sortSelectedLines(editor: Editor) {
	selectionsProcessor(editor, arr => arr.filter(isSelection), sel => {
		const {anchor:from, head:to}= expandSelection(editor, normalizeSelection(sel))
		editor.replaceRange(
			editor.getRange(from, to)
				.split("\n")
				.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
				.join("\n")
			, from, to)
		return expandSelection(editor,normalizeSelection(sel))
	})
}

const lowestSelection = (selections: EditorSelection[]): EditorSelection => {
	return selections.filter((sel,_i,arr) => 
		normalizeSelection(sel).head.line === Math.max(...arr.map(s => normalizeSelection(s).head.line))
	).filter((sel,_i,arr) =>
		normalizeSelection(sel).head.ch === Math.max(...arr.map(s =>normalizeSelection(s).head.ch))
	)[0]
}
const selectionValuesEqual = (editor: Editor, selections: EditorSelection[], case_sensitive: boolean): boolean => {
	return selections.every((val,_i,arr) => {
		const [one,two] = [arr[0],val].map(s => editor.getRange(...selToPos(normalizeSelection(s))))
		if (!case_sensitive) return one.toLowerCase() === two.toLowerCase()
		return one === two
	})
}

function selectWord(editor: Editor, sel: EditorSelection): EditorSelection{
	sel = normalizeSelection(sel)
	const txt = editor.getLine(sel.anchor.line)
	const postCh = (txt.substring(sel.anchor.ch).match(/^[\w]+/i) || [""])[0].length
	const preCh = (txt.substring(0,sel.anchor.ch).match(/[\w]+$/i) || [""])[0].length
	return {
		anchor: {line: sel.anchor.line, ch: sel.anchor.ch-preCh},
		head: {line: sel.anchor.line, ch: sel.anchor.ch+postCh}
	}
}

function selectWordInstances(editor: Editor, case_sensitive: boolean){
	const selections: EditorSelection[] = editor.listSelections()
	let range: EditorRange | undefined;
	if (selections.filter(isCaret).length > 0) selections.filter(isCaret).forEach((sel,i) => selections[i] = selectWord(editor,sel))
	else if (selections.filter(isSelection).length === selections.length && selectionValuesEqual(editor,selections,case_sensitive)) {
		let {anchor: from, head: to} = normalizeSelection(lowestSelection(selections))
		const tx = !case_sensitive ? editor.getRange(from,to).toLowerCase() : editor.getRange(from,to)
		const match = (!case_sensitive ? editor.getValue().toLowerCase() : editor.getValue())
			.substring(editor.posToOffset(to)).match(tx)
		if (match !== null){
			const sel = {
				anchor: editor.offsetToPos(editor.posToOffset(to)+(match.index||0)),
				head: editor.offsetToPos(editor.posToOffset(to)+(match.index||0)+tx.length)
			}
			selections.push(sel)
			range = selectionToRange(sel)
		}
		else {
			let searchText = !case_sensitive ? editor.getValue().toLowerCase() : editor.getValue()
			let shift = 0
			let match = searchText.match(tx)
			while (match !== null){
				const prevTx = (!case_sensitive ? editor.getValue().toLowerCase() : editor.getValue()).substring(0,shift+(match?.index ||0))
				const sel = {anchor: editor.offsetToPos(prevTx.length),head: editor.offsetToPos(prevTx.length+tx.length)}
				if (selections.filter(s => selectionsEqual(sel,s)).length === 0){
					selections.push(sel)
					range = selectionToRange(sel)
					break;
				}
				else {
					shift += (match?.index || 0)+tx.length
					searchText = searchText.substring((match?.index || 0)+tx.length)
				}
				match = searchText.match(tx)
			}
		}
	}
	editor.setSelections(selections);
	if (range !== undefined) editor.scrollIntoView(range);
}


function selectAllWordInstances(editor: Editor, case_sensitive: boolean){
	const selections: EditorSelection[] = editor.listSelections()
	selections.filter(isCaret).forEach((sel,i) => selections[i] = selectWord(editor,sel))
	if (selections.filter(isSelection).length === selections.length && selectionValuesEqual(editor,selections,case_sensitive)){
		const tx = getRangeSel(editor,selections[0])
		Array.from(editor.getValue().matchAll(new RegExp(tx,"g"+(case_sensitive?"":"i"))), v => v.index || 0)
		.forEach(v => {selections.push({anchor: {line: 0, ch: v},head: {line: 0, ch: v+tx.length}})})
	}
	else return;
	editor.setSelections(selections);
}

interface KeyshotsSettings {
	ide_mappings: string;
	s_m_w_i_case_sensitive: boolean;
	s_a_w_i_case_sensitive: boolean;
}

const DEFAULT_SETTINGS: KeyshotsSettings = {
	ide_mappings: "clear",
	s_a_w_i_case_sensitive: true,
	s_m_w_i_case_sensitive: true,
}

declare interface KeyshotsMap {
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
	select_multiple_word_instances?: Hotkey[]
	select_all_word_instances?: Hotkey[]
	toggle_inline_title?: Hotkey[]
	toggle_live_preview?: Hotkey[]
}

const DEFAULT_MAP: KeyshotsMap = {
	toggle_readable_length: [{ modifiers: ["Mod", "Shift"], key: "R" }],
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
	"vscode": { ...DEFAULT_MAP,
		move_line_up: [{ modifiers: ["Alt"], key: "ArrowUp" }],
		move_line_down: [{ modifiers: ["Alt"], key: "ArrowDown" }],
		duplicate_line_up: [{ modifiers: ["Alt", "Shift"], key: "ArrowUp" }],
		duplicate_line_down: [{ modifiers: ["Alt", "Shift"], key: "ArrowDown" }],
		select_multiple_word_instances: [{ modifiers: ["Mod"], key: "D" }],
		select_all_word_instances: [{ modifiers: ["Ctrl","Shift"], key: "L"}]
	},
	"jetbrains": { ...DEFAULT_MAP,
		move_line_up: [{ modifiers: ["Alt", "Shift"], key: "ArrowUp" }],
		move_line_down: [{ modifiers: ["Alt", "Shift"], key: "ArrowDown" }],
		duplicate_selection_or_line: [{ modifiers: ["Mod"], key: "D" }],
	},
	"visual_studio": { ...DEFAULT_MAP,
		move_line_up: [{ modifiers: ["Alt"], key: "ArrowUp" }],
		move_line_down: [{ modifiers: ["Alt"], key: "ArrowDown" }],
		add_carets_up: [{ modifiers: ["Alt", "Shift"], key: "ArrowUp" }],
		add_carets_down: [{ modifiers: ["Alt", "Shift"], key: "ArrowDown" }],
		duplicate_selection_or_line: [{ modifiers: ["Mod"], key: "D" }],
	},
	"clear": {}
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
		if (this.command_ids !== undefined) this.command_ids.forEach(cmd => this.app.commands.removeCommand(cmd))
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
				name: "Toggle readable line length (setting)",
				hotkeys: MAP.toggle_readable_length,
				callback: () => flipBooleanSetting(this.app,'readableLineLength')
			}).id,
			this.addCommand({
				id: 'toggle-line-numbers',
				name: "Toggle line numbers (setting)",
				hotkeys: MAP.toggle_line_numbers,
				callback: () => flipBooleanSetting(this.app,'showLineNumber')
			}).id,
			this.addCommand({
				id: 'toggle-inline-title',
				name: "Toggle inline title (setting)",
				hotkeys: MAP.toggle_inline_title,
				callback: () => flipBooleanSetting(this.app,'showInlineTitle')
			}).id,
			this.addCommand({
				id: 'toggle-live-preview',
				name: "Toggle live preview (setting)",
				hotkeys: MAP.toggle_live_preview,
				callback: () => flipBooleanSetting(this.app,'livePreview')
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
				editorCallback: (editor) => moveLine(editor, VerticalDirection.UP, 0)
			}).id,
			this.addCommand({
				id: 'move-line-down',
				name: 'Move line down',
				hotkeys: MAP.move_line_down,
				editorCallback: (editor) => moveLine(editor, VerticalDirection.DOWN, editor.lineCount()-1)
			}).id,
			this.addCommand({
				id: 'add-carets-up',
				name: 'Add caret cursor up',
				hotkeys: MAP.add_carets_up,
				editorCallback: (editor) => addCarets(editor, VerticalDirection.UP, 0)
			}).id,
			this.addCommand({
				id: 'add-carets-down',
				name: 'Add caret cursor down',
				hotkeys: MAP.add_carets_down,
				editorCallback: (editor) => addCarets(editor, VerticalDirection.DOWN, editor.lineCount())
			}).id,
			this.addCommand({
				id: 'duplicate-line-up',
				name: 'Duplicate line up (Visual Studio Code)',
				hotkeys: MAP.duplicate_line_up,
				editorCallback: (editor) => vscodeDuplicate(editor, VerticalDirection.UP)
			}).id,
			this.addCommand({
				id: 'duplicate-line-down',
				name: 'Duplicate line down (Visual Studio Code)',
				hotkeys: MAP.duplicate_line_down,
				editorCallback: (editor) => vscodeDuplicate(editor, VerticalDirection.DOWN)
			}).id,
			this.addCommand({
				id: 'duplicate-selection-or-line',
				name: 'Duplicate selection or line (JetBrains IDEs)',
				hotkeys: MAP.duplicate_selection_or_line,
				editorCallback: (editor) => jetBrainsDuplicate(editor)
			}).id,
			this.addCommand({
				id: 'insert-line-above',
				name: "Insert line above",
				hotkeys: MAP.insert_line_above,
				editorCallback: (editor) => insertLine(editor, VerticalDirection.UP)
			}).id,
			this.addCommand({
				id: 'insert-line-below',
				name: "Insert line below",
				hotkeys: MAP.insert_line_below,
				editorCallback: (editor) => insertLine(editor, VerticalDirection.DOWN)
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
				SELECTION CREATION
			========================================================================
			*/
			this.addCommand({
				id: 'select-multiple-word-instances',
				name: "Select multiple word instances",
				hotkeys: MAP.select_multiple_word_instances,
				editorCallback: (editor) => selectWordInstances(editor, this.settings.s_m_w_i_case_sensitive)
			}).id,
			this.addCommand({
				id: 'select-all-word-instances',
				name: "Select all word instances",
				hotkeys: MAP.select_all_word_instances,
				editorCallback: (editor) => selectAllWordInstances(editor, this.settings.s_a_w_i_case_sensitive)
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

class DocumentFragmentBuilder{
	#fragment: DocumentFragment
	constructor(){
		this.#fragment = document.createDocumentFragment()
	}

	appendText(text:string){
		this.#fragment.append(text)
		return this
	}

	createElem(tag: keyof HTMLElementTagNameMap, o?: DomElementInfo | string){
		this.#fragment.createEl(tag,o)
		return this
	}

	toFragment(): DocumentFragment{
		return this.#fragment
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
		containerEl.createEl('h2', { text: "⌨️ Default keys" })
		new Setting(containerEl)
			.setName("IDE Keys Mapping")
			.setDesc("Change default hotkeys based on IDE, that you are comfortable with. This does not overwrite your custom hotkeys!")
			.setDesc(new DocumentFragmentBuilder()
				.appendText("Change default hotkeys based on IDE, that you are comfortable with.")
				.createElem("br")
				.createElem("b", {text: "❗This does not overwrite your custom Keyshots hotkeys configuration!"})
				.toFragment()
			)
			.addDropdown(cb => cb
				.addOption("clear", "Clear (everything blank; default)")
				.addOption("vscode", "Visual Studio Code")
				.addOption("jetbrains", "JetBrains IDEs (IntelliJ IDEA, Pycharm, ... )")
				.addOption("visual_studio", "Microsoft Visual Studio")
				.setValue(this.plugin.settings.ide_mappings)
				.onChange(async (value) => {
					this.plugin.settings.ide_mappings = value
					await this.plugin.loadCommands()
					await this.plugin.saveSettings()
				})
			)
		containerEl.createEl('h2', { text: "⚙️ Other settings" })
		new Setting(containerEl)
			.setName(new DocumentFragmentBuilder()
				.createElem("kbd",{text:"select-multiple-word-instances"})
				.appendText(" case sensitivity")
				.toFragment()
			)
			.setDesc("Determines if command should check case sensitivity while matching several text pieces.")
			.addToggle(cb => cb
				.setValue(this.plugin.settings.s_m_w_i_case_sensitive)
				.onChange(async (value) => {
					this.plugin.settings.s_m_w_i_case_sensitive = value
					await this.plugin.saveSettings()
				})
			)
		new Setting(containerEl)
			.setName(new DocumentFragmentBuilder()
				.createElem("kbd",{text:"select-all-word-instances"})
				.appendText(" case sensitivity")
				.toFragment()
			)
			.setDesc("Determines if command should check case sensitivity while matching all text pieces.")
			.addToggle(cb => cb
				.setValue(this.plugin.settings.s_a_w_i_case_sensitive)
				.onChange(async (value) => {
					this.plugin.settings.s_a_w_i_case_sensitive = value
					await this.plugin.saveSettings()
				})
			)
	}
}
