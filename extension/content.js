window.postMessage({ type: 'CYBERGUARD_EXT_CONNECTED' }, '*');
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CYBERGUARD_PING') {
    window.postMessage({ type: 'CYBERGUARD_EXT_CONNECTED' }, '*');
  }
  if (event.data && event.data.type === 'SET_BLOCKING_MODE') {
    chrome.runtime.sendMessage(event.data);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CYBERGUARD_DOWNLOAD_BLOCKED') {
    window.postMessage(message, '*');
  }
});
