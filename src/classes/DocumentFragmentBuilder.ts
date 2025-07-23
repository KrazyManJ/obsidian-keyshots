export default class DocumentFragmentBuilder {
    readonly #fragment: DocumentFragment

    constructor() {
        this.#fragment = document.createDocumentFragment()
    }

    appendText(text: string) {
        this.#fragment.append(text)
        return this
    }

    createElem(tag: keyof HTMLElementTagNameMap, o?: DomElementInfo | string) {
        this.#fragment.createEl(tag, o)
        return this
    }

    toFragment(): DocumentFragment {
        return this.#fragment
    }
}