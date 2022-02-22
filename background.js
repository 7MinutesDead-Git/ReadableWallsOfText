let lineHeight = 2;

chrome.runtime.onInstalled.addListener(() => {
    // This will allow multiple extension components to access this value and update it.
    chrome.storage.sync.set({ lineHeight });
    console.log(`Default line height set to ${lineHeight}rem`);
});
