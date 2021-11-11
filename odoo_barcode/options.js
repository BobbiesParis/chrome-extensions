// Initialize submit
let submitButton = document.getElementById("submit");

// When the button is clicked, save options in chrome storage
submitButton.addEventListener("click", () => {
    const options = {};
    let inputs = document.getElementsByTagName('input');
    for (var i=0; i<inputs.length; i++ ) {
        let input = inputs[i];
        if ( input.type === 'checkbox' ) {
            options[input.id] = input.checked;
        } else if ( input.type === 'text' ) {
            options[input.id] = input.value;
        }
    }
    chrome.storage.sync.set({ options });
});

// Initialize the page by constructing the options
function constructOptions() {
    const options = {};
    chrome.storage.sync.get('options', (data) => {
        Object.assign(options, data.options);
        for ( const option of Object.keys(options) ) {
            let attr = options[option] == "boolean" ? 'checked' : 'value'
            document.getElementById(option)[attr] = options[option];
        }
    });
}
constructOptions();
