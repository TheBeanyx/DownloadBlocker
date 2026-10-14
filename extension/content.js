// CyberGuard Content Script Bridge

// Állapotjelzés küldése a weboldalnak
window.postMessage({ type: 'CYBERGUARD_EXT_CONNECTED' }, '*');

// Figyeljük a weboldal felől érkező kéréseket (pl. PING vagy beállítás váltás)
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CYBERGUARD_PING') {
    window.postMessage({ type: 'CYBERGUARD_EXT_CONNECTED' }, '*');
  }
  if (event.data && event.data.type === 'SET_BLOCKING_MODE') {
    chrome.runtime.sendMessage(event.data);
  }
});

// Háttérszálról érkező értesítések továbbítása a weboldalnak
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CYBERGUARD_DOWNLOAD_BLOCKED') {
    window.postMessage(message, '*');
  }
});