let options = {
    close_window: false,
    default_timeout: 0,
    command_timeout: 1200
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ options });
});
