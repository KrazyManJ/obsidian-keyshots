declare namespace electron {
    const remote: Remote

    interface WebContents {
        openDevTools(): void;
    }

    interface Window {
        webContents: WebContents;
        setFullScreen(state: boolean): void;
    }

    interface BrowserWindow {
        getAllWindows(): Window[];
    }

    interface Remote {
        getCurrentWindow(): Window;
        BrowserWindow: BrowserWindow;
    }
}