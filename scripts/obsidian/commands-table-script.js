(() => {
    /* eslint-disable no-undef */
    const keyshots = app.plugins.plugins.keyshots;
    const curPreset = keyshots.settings.ide_mappings;
    const prevKeyshotMapping = keyshots.settings.keyshot_mappings
    keyshots.settings.keyshot_mappings = false;
    const data = {};
    const tokbd = (v) => `<kbd>${v}</kbd>`
    const getCommands = () => JSON.parse(JSON.stringify(Object.values(app.commands.commands)))
    .filter(data => data.id.startsWith("keyshots"))
    .sort((a,b) => a.category.localeCompare(b.category))
        .map(v => {
            v.name = v.name.substring(10);
            return v;
        })
    getCommands().forEach(v => {
        data[v.name] = {}
    });
    const titles = ["Hotkeys"]
    keyshots.availablePresets().slice(1).forEach(p => {
        titles.push(keyshots.getPresetTitle(p))
        keyshots.changePreset(p);
        getCommands().forEach(v => {
            const cmdName = v.name;
            if (v.hotkeys) {
                const hotkey = v.hotkeys[0]
                data[cmdName][p] = hotkey.modifiers.map(v => tokbd(v === "Mod" ? "Ctrl" : v)).join(" + ") + (hotkey.modifiers.length > 0 ? " + " : "") + tokbd(v.hotkeys[0].key.replace("ArrowUp","↑").replace("ArrowDown","↓"));
            } else data[cmdName][p] = ""
        })
    })
    keyshots.changePreset(curPreset);
    keyshots.settings.keyshot_mappings = prevKeyshotMapping;
    return `| ${titles.join(" | ")} |\n${"| --- ".repeat(5)}|\n` + Object.entries(data).map(([name, hotkeys]) => `| \`${name}\` | ${Object.values(hotkeys).join(" | ")} |`).join("\n");
})()