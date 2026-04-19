let currentShortcut = "ctrl+y";
let isGrayscale = false;

browser.storage.local.get({ shortcut: "ctrl+y" }).then((res) => {
  currentShortcut = res.shortcut;
});

browser.storage.onChanged.addListener((changes) => {
  if (changes.shortcut) {
    currentShortcut = changes.shortcut.newValue;
  }
});

document.addEventListener("keydown", (e) => {
  let keys = [];
  if (e.ctrlKey) keys.push("ctrl");
  if (e.altKey) keys.push("alt");
  if (e.shiftKey) keys.push("shift");
  if (e.metaKey) keys.push("meta");

  if (!["Control", "Alt", "Shift", "Meta"].includes(e.key)) {
    keys.push(e.key.toLowerCase());
  }

  const pressed = keys.join("+");

  if (pressed === currentShortcut) {
    const activeEl = document.activeElement
      ? document.activeElement.tagName.toLowerCase()
      : "";
    if (
      activeEl === "input" ||
      activeEl === "textarea" ||
      document.activeElement.isContentEditable
    )
      return;

    e.preventDefault();
    isGrayscale = !isGrayscale;

    // Toggle efek visual di web
    if (isGrayscale) {
      document.documentElement.classList.add("working-gray-mode");
    } else {
      document.documentElement.classList.remove("working-gray-mode");
    }

    // Kirim sinyal ke background.js buat ganti icon
    browser.runtime.sendMessage({
      type: "UPDATE_ICON",
      isGrayscale: isGrayscale,
    });

    // Dengerin kalau popup nanya status
    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === "GET_STATE") {
        sendResponse({ isGrayscale: isGrayscale });
      }
    });
  }
});
