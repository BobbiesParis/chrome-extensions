// Initialize submit
let submitButton = document.getElementById("submit");

// When the button is clicked, inject setFormInput into current page
submitButton.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let barcode = document.getElementById("barcode").value;

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: simulateBarcodeScan,
        args: [barcode],
    });
    window.close();
});

// The body of this function will be executed as a content script inside the
// current page
function simulateBarcodeScan(barcode) {
    console.log('barcode=' + barcode)
    function triggerKeypressEvent(char) {
        var keycode;
        if (char === "Enter") {
            keycode = 13;
        } else {
            keycode = char.charCodeAt(0);
        }
        return document.body.dispatchEvent(
            new KeyboardEvent('keypress', { keyCode: keycode })
        );
    }
    barcode.split('').concat('Enter').map(triggerKeypressEvent);
}
