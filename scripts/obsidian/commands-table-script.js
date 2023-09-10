(() => {
    /* eslint-disable no-undef */
    const keyshots = app.plugins.plugins.keyshots;
    const curPreset = keyshots.settings.ide_mappings;
    const keyshotMappings = keyshots.settings.keyshot_mappings;
    keyshots.settings.keyshot_mappings = false;
    const data = {};
    const tokbd = (v) => `<kbd>${v}</kbd>`
    const getCommands = () => JSON.parse(JSON.stringify(Object.values(app.commands.commands)))
        .filter(data => data.id.startsWith("keyshots"))
        .map(v => {
            v.name = v.name.substring(10);
            return v;
        })
    console.log(getCommands())
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
                data[cmdName][p] = hotkey.modifiers.map(v => tokbd(v === "Mod" ? "Ctrl" : v)).join(" + ") + " + " + tokbd(v.hotkeys[0].key);
            } else data[cmdName][p] = ""
        })
    })
    keyshots.changePreset(curPreset);
    keyshots.settings.keyshot_mappings = keyshotMappings;
    return `| ${titles.join(" | ")} |\n${"| --- ".repeat(5)}|\n` + Object.entries(data).map(([name, hotkeys]) => `| \`${name}\` | ${Object.values(hotkeys).join(" | ")} |`).join("\n");
})()