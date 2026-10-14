const SHIELD_ICON = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="%23ef4444"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v6h-2V7zm1 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>';

chrome.downloads.onCreated.addListener((downloadItem) => {
  chrome.storage.local.get(['protectionEnabled', 'overrideActive', 'overrideTime'], (res) => {
    const protectionEnabled = res.protectionEnabled !== false;
    const overrideActive = res.overrideActive === true;
    const overrideTime = res.overrideTime || 0;

    const isOverrideValid = overrideActive && (Date.now() - overrideTime < 60000);

    if (isOverrideValid) {
      console.log("Letöltés jelszóval engedélyezve:", downloadItem.filename);
      chrome.storage.local.set({ overrideActive: false });
      return;
    }

    if (!protectionEnabled) {
      console.log("Védelem kikapcsolva, letöltés engedélyezve.");
      return;
    }

    chrome.downloads.cancel(downloadItem.id, () => {
      chrome.downloads.erase({ id: downloadItem.id });

      chrome.notifications.create('download_blocked_' + Date.now(), {
        type: 'basic',
        iconUrl: SHIELD_ICON,
        title: '🛡️ Letöltés Megszakítva!',
        message: `A(z) "${downloadItem.filename || 'fájl'}" letöltése le lett tiltva. Letöltéshez adja meg a jelszót a bővítményben!`,
        priority: 2,
        requireInteraction: true
      });
    });
  });
});
