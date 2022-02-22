// The body of this function will be executed as a content script inside the
// current page.
function setLineHeight() {
    // Nesting this helper function declaration is necessary for chrome scripting scope,
    // since setLineHeight is called from a content script and I don't know enough about
    // chrome extension content scripts yet.
    function adjustStyle(element, lineHeight) {
        element.style.lineHeight = lineHeight
        element.style.transition = 'all 0.5s ease-in-out'
    }
    chrome.storage.sync.get("lineHeight", ({ lineHeight }) => {
        const remValue = `${lineHeight}rem`
        // YouTube comments are a bit more squished than normal paragraphs,
        // so we'll increase the line height by a greater factor.
        const heightFactor = 1.5
        const youTubeRemValue = `${lineHeight * heightFactor}rem`

        const paragraphs = document.querySelectorAll('p')
        const spans = document.querySelectorAll('span')
        const listItems = document.querySelectorAll('li')

        const youTubeComments = document.querySelectorAll('yt-formatted-string')

        const normalElements = [paragraphs, spans, listItems]
        for (const query of normalElements) {
            for (const element of query) {
                adjustStyle(element, remValue)
            }
        }

        if (youTubeComments !== null) {
            for (const comment of youTubeComments) {
                adjustStyle(comment, `${youTubeRemValue}rem`)
            }
        }
    });
}

// Initialize button with user's preferred line height.
let btn = document.getElementById("btn-line-height");

// When the button is clicked, inject setLineHeight into current page elements.
btn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setLineHeight,
    });
});
