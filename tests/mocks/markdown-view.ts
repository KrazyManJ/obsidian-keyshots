import type { MarkdownView } from "obsidian";

export const emptyMarkdownViewMock = {} as MarkdownView;

export function createMockMarkdownView(
    isLivePreview = true
): jest.Mocked<MarkdownView> {
    return {
        getState: jest.fn(() => ({ source: !isLivePreview })),
    } as Partial<jest.Mocked<MarkdownView>> as jest.Mocked<MarkdownView>;
}
