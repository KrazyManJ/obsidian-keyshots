import { indent, unindent } from '../../src/commands/indent'

// Minimal Editor/Selection shapes matching only what's needed
interface Pos { line: number; ch: number }
interface Sel { anchor: Pos; head: Pos }

class MockEditor {
  private lines: string[]
  private selections: Sel[]

  constructor(text: string, selections: Sel[]) {
    this.lines = text.split('\n')
    this.selections = selections
  }

  listSelections(): Sel[] { return this.selections }
  getLine(line: number): string { return this.lines[line] ?? '' }

  getRange(from: Pos, to: Pos): string {
    if (from.line === to.line) {
      const line = this.getLine(from.line)
      return line.slice(from.ch, to.ch)
    }
    const parts: string[] = []
    parts.push(this.getLine(from.line).slice(from.ch))
    for (let l = from.line + 1; l < to.line; l++) parts.push(this.getLine(l))
    parts.push(this.getLine(to.line).slice(0, to.ch))
    return parts.join('\n')
  }

  transaction(tx: { changes?: { from: Pos; to: Pos; text: string }[]; selections?: { from: Pos; to: Pos }[] }) {
    if (tx.changes && tx.changes.length) {
      for (const ch of tx.changes) {
        const { from, to, text } = ch
        if (from.line !== to.line) throw new Error('MockEditor: only single-line changes supported in this test')
        const line = this.lines[from.line]
        this.lines[from.line] = line.slice(0, from.ch) + text + line.slice(to.ch)
      }
    }
    if (tx.selections && tx.selections.length) {
      this.selections = tx.selections.map(r => ({ anchor: r.from, head: r.to }))
    }
  }

  getText(): string { return this.lines.join('\n') }
  getSelections(): Sel[] { return this.selections }
}

// Minimal plugin stub supplying useTabs config (spaces by default)
const plugin: any = {
  app: { vault: { getConfig: (k: string) => (k === 'useTabs' ? false : undefined) } },
}

describe('indent/unindent with multiple carets on the same line', () => {
  test('indent does not duplicate line and shifts carets', () => {
    const input = 'line with text.'
    const carets = [6, 12]
    const selections: Sel[] = carets.map(ch => ({ anchor: { line: 0, ch }, head: { line: 0, ch } }))
    const editor = new MockEditor(input, selections)

    indent(plugin).editorCallback!(editor as unknown as any)

    // Content is indented once (4 spaces)
    expect(editor.getText()).toBe('    line with text.')

    // All carets shift by +4
    const final = editor.getSelections()
    expect(final).toHaveLength(carets.length)
    final.forEach((sel, i) => {
      expect(sel.anchor).toMatchObject({ line: 0, ch: carets[i] + 4 })
      expect(sel.head).toMatchObject({ line: 0, ch: carets[i] + 4 })
    })
  })

  test('unindent does not duplicate line and shifts carets', () => {
    const input = '    line with text.'
    const carets = [10, 16]
    const selections: Sel[] = carets.map(ch => ({ anchor: { line: 0, ch }, head: { line: 0, ch } }))
    const editor = new MockEditor(input, selections)

    unindent(plugin).editorCallback!(editor as unknown as any)

    // Content is unindented once
    expect(editor.getText()).toBe('line with text.')

    // All carets shift by -4
    const final = editor.getSelections()
    expect(final).toHaveLength(carets.length)
    final.forEach((sel, i) => {
      expect(sel.anchor).toMatchObject({ line: 0, ch: carets[i] - 4 })
      expect(sel.head).toMatchObject({ line: 0, ch: carets[i] - 4 })
    })
  })
})
