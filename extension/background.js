// background.js - Javított értesítési kód

// Egy piros pajzs ikon Base64 formátumban (hogy ne kelljen külön fájlt csatolni)
const SHIELD_ICON = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="%23ef4444"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v6h-2V7zm1 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>';

chrome.downloads.onCreated.addListener((downloadItem) => {
  console.log("Letöltés észlelve:", downloadItem.filename || downloadItem.url);

  // 1. Letöltés azonnali megszakítása
  chrome.downloads.cancel(downloadItem.id, () => {
    // 2. Fájl törlése a lemezről / letöltési előzményekből
    chrome.downloads.erase({ id: downloadItem.id });

    // 3. Natív Windows / macOS / Chrome Értesítés küldése
    chrome.notifications.create('download_blocked_' + Date.now(), {
      type: 'basic',
      iconUrl: SHIELD_ICON, // Kötelező mező!
      title: '🛡️ Letöltés megszakítva!',
      message: `A(z) "${downloadItem.filename || 'ismeretlen fájl'}" letöltése biztonsági okokból le lett tiltva és el lett távolítva.`,
      priority: 2, // Legmagasabb prioritás
      requireInteraction: true // Ott marad a képernyőn, amíg nem kattintasz rá
    }, (notificationId) => {
      if (chrome.runtime.lastError) {
        console.error("Értesítés hiba:", chrome.runtime.lastError.message);
      } else {
        console.log("Értesítés sikeresen elküldve ID:", notificationId);
      }
    });

    // 4. Üzenet küldése a nyitott weboldalnak (ha nyitva van a szimulátor)
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          type: "DOWNLOAD_BLOCKED",
          filename: downloadItem.filename || "ismeretlen_fájl",
          url: downloadItem.url
        }).catch(() => {}); // Figyelmen kívül hagyjuk azokat a lapokat, ahol nincs content script
      });
    });
  });
});