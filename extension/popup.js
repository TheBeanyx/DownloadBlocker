document.addEventListener('DOMContentLoaded', () => {
    const statusPill = document.getElementById('statusPill');
    const setupView = document.getElementById('setupView');
    const mainView = document.getElementById('mainView');
    const overrideView = document.getElementById('overrideView');

    const regPass = document.getElementById('regPass');
    const regBtn = document.getElementById('regBtn');
    const regMsg = document.getElementById('regMsg');

    const toggleBtn = document.getElementById('toggleBtn');
    const authBox = document.getElementById('authBox');
    const authPass = document.getElementById('authPass');
    const authBtn = document.getElementById('authBtn');
    const mainMsg = document.getElementById('mainMsg');

    const showOverrideBtn = document.getElementById('showOverrideBtn');
    const overrideBox = document.getElementById('overrideBox');
    const overPass = document.getElementById('overPass');
    const overBtn = document.getElementById('overBtn');
    const overMsg = document.getElementById('overMsg');

    function refresh() {
        chrome.storage.local.get(['protectionEnabled', 'protectionPassword'], (res) => {
            const active = res.protectionEnabled !== false;
            const hasPass = !!res.protectionPassword;

            if (active) {
                statusPill.textContent = "AKTÍV";
                statusPill.className = "pill active";
                toggleBtn.textContent = "Kikapcsolás";
                toggleBtn.className = "btn btn-danger";
            } else {
                statusPill.textContent = "LETILTVA";
                statusPill.className = "pill disabled";
                toggleBtn.textContent = "Bekapcsolás";
                toggleBtn.className = "btn btn-success";
            }

            if (!hasPass) {
                setupView.classList.remove('hidden');
                mainView.classList.add('hidden');
                overrideView.classList.add('hidden');
            } else {
                setupView.classList.add('hidden');
                mainView.classList.remove('hidden');
                overrideView.classList.remove('hidden');
            }
        });
    }

    regBtn.addEventListener('click', () => {
        const p = regPass.value.trim();
        if (p.length < 3) {
            regMsg.textContent = "Min. 3 karakter!";
            regMsg.className = "msg error";
            return;
        }
        chrome.storage.local.set({ protectionPassword: p }, () => {
            regMsg.textContent = "Mentve!";
            regMsg.className = "msg success";
            setTimeout(refresh, 600);
        });
    });

    toggleBtn.addEventListener('click', () => {
        chrome.storage.local.get(['protectionEnabled'], (res) => {
            const active = res.protectionEnabled !== false;
            if (active) {
                authBox.classList.toggle('hidden');
            } else {
                chrome.storage.local.set({ protectionEnabled: true }, () => {
                    authBox.classList.add('hidden');
                    refresh();
                });
            }
        });
    });

    authBtn.addEventListener('click', () => {
        chrome.storage.local.get(['protectionPassword'], (res) => {
            if (authPass.value === res.protectionPassword) {
                chrome.storage.local.set({ protectionEnabled: false }, () => {
                    authPass.value = '';
                    authBox.classList.add('hidden');
                    refresh();
                });
            } else {
                mainMsg.textContent = "Hibás jelszó!";
                mainMsg.className = "msg error";
            }
        });
    });

    showOverrideBtn.addEventListener('click', () => {
        overrideBox.classList.toggle('hidden');
    });

    overBtn.addEventListener('click', () => {
        chrome.storage.local.get(['protectionPassword'], (res) => {
            if (overPass.value === res.protectionPassword) {
                chrome.storage.local.set({ overrideActive: true, overrideTime: Date.now() }, () => {
                    overPass.value = '';
                    overrideBox.classList.add('hidden');
                    overMsg.textContent = "Engedélyezve (60mp)!";
                    overMsg.className = "msg success";
                });
            } else {
                overMsg.textContent = "Hibás jelszó!";
                overMsg.className = "msg error";
            }
        });
    });

    refresh();
});
