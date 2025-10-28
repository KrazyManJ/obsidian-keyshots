import type { MarkdownView } from "obsidian";

export const emptyMarkdownMock = {} as MarkdownView;

export function createMockMarkdownView(
    isLivePreview = true
): MarkdownView {
    return {
        getState: jest.fn(() => ({ source: !isLivePreview })),
    } as Partial<MarkdownView> as MarkdownView;
}
