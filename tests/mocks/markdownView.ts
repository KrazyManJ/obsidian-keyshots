import type { MarkdownView } from "obsidian";

export const emptyMarkdownMock = {} as MarkdownView;

export function createMockMarkdownView(
    state: Partial<ReturnType<MarkdownView["getState"]>> = {}
): MarkdownView {
    return {
        getState: jest.fn(() => ({ ...{ source: false }, ...state })),
    } as Partial<MarkdownView> as MarkdownView;
}
