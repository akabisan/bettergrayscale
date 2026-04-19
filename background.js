browser.runtime.onMessage.addListener((request, sender) => {
  if (request.type === "UPDATE_ICON") {
    // Pilih icon berdasarkan status grayscale
    const iconPath = request.isGrayscale ? "icon-gray.png" : "icon-color.png";

    // Ganti icon spesifik hanya untuk tab yang sedang aktif dipencet
    browser.action.setIcon({
      tabId: sender.tab.id,
      path: iconPath,
    });
  }
});
