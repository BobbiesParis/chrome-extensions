// Initialize submit
let submitButton = document.getElementById("submit");

// When the button is clicked, inject simulateBarcodeScan into current page
submitButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let barcode = document.getElementById("barcode").value;

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: simulateBarcodeScan,
        args: [barcode],
    });
    chrome.storage.sync.get("options", (data) => {
        if (data.options.close_window) {
            window.close();
        }
    });
});

// The body of this function will be executed as a content script inside the
// current page
function simulateBarcodeScan(barcode) {
    let triggerKeypressEvent = (char) => {
        let keycode;
        if (char === "Enter") {
            keycode = 13;
        } else {
            keycode = char.charCodeAt(0);
        }
        return document.body.dispatchEvent(
            new KeyboardEvent('keypress', { keyCode: keycode, which:keycode })
        );
    };
    let triggerKeydownEvent = (char) => {
        return document.body.dispatchEvent(
            new KeyboardEvent("keydown", { key: char })
        );
    };
    for (const code of barcode.split(/\r?\n/g)) {
        let send = (cstring) => {
            // Odoo < 16.0
            cstring.split('').concat('Enter').map(triggerKeypressEvent);
            // Odoo >= 16.0
            cstring.split('').concat('Enter').map(triggerKeydownEvent);
        }
        chrome.storage.sync.get('options', (data) => {
            const attr = code.startsWith('O-CMD.') || code.startsWith('O-BTN.')
                ? 'command' : 'default'
            setTimeout(send, data.options[attr + '_timeout'], code);
        });
    }
}
