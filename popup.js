const resetBtn = document.getElementById("reset-default");

function updateUI(shortcut) {
  const parts = shortcut.split("+");
  const container = document.getElementById("shortcut-container");
  container.innerHTML = "";
  const modMap = { ctrl: "Ctrl", shift: "Shift", alt: "Alt", meta: "Meta" };
  parts.forEach((part, i) => {
    const box = document.createElement("div");
    box.className = i === parts.length - 1 ? "key-box char-box" : "key-box";
    box.textContent = i === parts.length - 1 ? part.toUpperCase() : (modMap[part] || part);
    container.appendChild(box);
  });
}

browser.storage.local.get({ shortcut: "ctrl+y" }).then((res) => {
  updateUI(res.shortcut);
});

document.addEventListener("keydown", (e) => {
  e.preventDefault();

  const isModOnly = ["Control", "Alt", "Shift", "Meta"].includes(e.key);

  let mods = [];
  if (e.ctrlKey) mods.push("ctrl");
  if (e.altKey) mods.push("alt");
  if (e.shiftKey) mods.push("shift");
  if (e.metaKey) mods.push("meta");

  if (isModOnly) {
    const container = document.getElementById("shortcut-container");
    container.innerHTML = "";
    const modMap = { ctrl: "Ctrl", shift: "Shift", alt: "Alt", meta: "Meta" };
    mods.forEach(mod => {
      const box = document.createElement("div");
      box.className = "key-box";
      box.textContent = modMap[mod];
      container.appendChild(box);
    });
    const charBox = document.createElement("div");
    charBox.className = "key-box char-box";
    charBox.textContent = "?";
    container.appendChild(charBox);
    return;
  }

  if (mods.length > 0 && e.key && e.key.length === 1) {
    const char = e.key.toLowerCase();
    const newShortcut = [...mods, char].join("+");
    browser.storage.local.set({ shortcut: newShortcut }).then(() => updateUI(newShortcut));
  }
});

resetBtn.addEventListener("click", () => {
  browser.storage.local.set({ shortcut: "ctrl+y" }).then(() => {
    updateUI("ctrl+y");
  });
});
