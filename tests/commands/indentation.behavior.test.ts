import {indent, unindent} from '../../src/commands/indent'

// Minimal Editor/Selection shapes matching only what's needed
interface Pos {
    line: number;
    ch: number
}

interface Sel {
    anchor: Pos;
    head: Pos
}

class TestEditor {
    private lines: string[]
    private selections: Sel[]

    constructor(text: string, selections: Sel[]) {
        this.lines = text.split('\n')
        this.selections = selections
    }

    listSelections(): Sel[] {
        return this.selections
    }

    getLine(line: number): string {
        return this.lines[line] ?? ''
    }

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
                const {from, to, text} = ch
                const before = this.lines.slice(0, from.line)
                const after = this.lines.slice(to.line + 1)

                const startHead = this.lines[from.line]?.slice(0, from.ch) ?? ''
                const endTail = this.lines[to.line]?.slice(to.ch) ?? ''

                const replLines = text.split('\n')
                const merged: string[] = []
                if (replLines.length === 1) {
                    merged.push(startHead + replLines[0] + endTail)
                } else {
                    merged.push(startHead + replLines[0])
                    for (let i = 1; i < replLines.length - 1; i++) merged.push(replLines[i])
                    merged.push(replLines[replLines.length - 1] + endTail)
                }

                this.lines = [...before, ...merged, ...after]
            }
        }
        if (tx.selections && tx.selections.length) {
            this.selections = tx.selections.map(r => ({anchor: r.from, head: r.to}))
        }
    }

    getText(): string {
        return this.lines.join('\n')
    }

    getSelections(): Sel[] {
        return this.selections
    }
}

// Minimal plugin stub supplying useTabs config (spaces by default)
const plugin: any = {app: {vault: {getConfig: (k: string) => (k === 'useTabs' ? false : undefined)}}}

describe('indent/unindent with multiple carets on the same line', () => {
    test('indent does not duplicate line and shifts carets', () => {
        const input = 'line with text.'
        const carets = [6, 12]
        const selections: Sel[] = carets.map(ch => ({anchor: {line: 0, ch}, head: {line: 0, ch}}))
        const editor = new TestEditor(input, selections)

        indent(plugin).editorCallback!(editor as unknown as any)

        // Content is indented once (4 spaces)
        expect(editor.getText()).toBe('    line with text.')

        // All carets shift by +4
        const final = editor.getSelections()
        expect(final).toHaveLength(carets.length)
        final.forEach((sel, i) => {
            expect(sel.anchor).toMatchObject({line: 0, ch: carets[i] + 4})
            expect(sel.head).toMatchObject({line: 0, ch: carets[i] + 4})
        })
    })

    test('unindent does not duplicate line and shifts carets', () => {
        const input = '    line with text.'
        const carets = [10, 16]
        const selections: Sel[] = carets.map(ch => ({anchor: {line: 0, ch}, head: {line: 0, ch}}))
        const editor = new TestEditor(input, selections)

        unindent(plugin).editorCallback!(editor as unknown as any)

        // Content is unindented once
        expect(editor.getText()).toBe('line with text.')

        // All carets shift by -4
        const final = editor.getSelections()
        expect(final).toHaveLength(carets.length)
        final.forEach((sel, i) => {
            expect(sel.anchor).toMatchObject({line: 0, ch: carets[i] - 4})
            expect(sel.head).toMatchObject({line: 0, ch: carets[i] - 4})
        })
    })
})

describe('unindent: multi-line selection behaves like single-line unindent per line', () => {
    const input = [
        'line',
        '- no space before -',
        ' - 1 space before -',
        '  - 2 space before -',
        '   - 3 space before -',
        '    - 4 space before -',
        '     - 5',
        '      - 6',
        '       - 7',
        '        - 8',
        '         - 9 ',
        '          - 10',
        '           - 11',
        '            - 12',
        '             - 13',
        '              - 14',
        '               - 15',
        '                - 16',
        '                 - 17',
        '                  - 18',
    ].join('\n')

    const expected = [
        'line',
        '- no space before -',
        '- 1 space before -',
        '- 2 space before -',
        '- 3 space before -',
        '- 4 space before -',
        ' - 5',
        '  - 6',
        '   - 7',
        '    - 8',
        '     - 9 ',
        '      - 10',
        '       - 11',
        '        - 12',
        '         - 13',
        '          - 14',
        '           - 15',
        '            - 16',
        '             - 17',
        '              - 18',
    ].join('\n')


    test('Ctrl+A style selection unindents all lines by one indent unit', () => {
        const lines = input.split('\n')
        const lastIdx = lines.length - 1
        const selections: Sel[] = [{anchor: {line: 0, ch: 0}, head: {line: lastIdx, ch: lines[lastIdx].length}}]
        const editor = new TestEditor(input, selections)

        unindent(plugin).editorCallback!(editor as unknown as any)

        expect(editor.getText()).toBe(expected)
    })
})
