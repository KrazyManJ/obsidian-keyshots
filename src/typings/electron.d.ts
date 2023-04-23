declare namespace electron {
    const remote: Remote

    interface BrowserWindow {
        webContents: {
            openDevTools: () => void;
        };
    }
    interface Remote {
        getCurrentWindow(): BrowserWindow;
    }
}