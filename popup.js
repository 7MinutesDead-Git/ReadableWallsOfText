// Set the user preferred line height for paragraphs, spans, list items, and
// even YouTube comments.
// The body of this function will be executed as a content script inside the
// current page.
function setLineHeight(rangeInput) {
    // Nesting this helper function declaration is necessary for chrome scripting scope,
    // since setLineHeight is called from a content script and I don't know enough about
    // chrome extension content scripts yet.
    function adjustStyle(element, lineHeight) {
        element.style.lineHeight = lineHeight
        element.style.transition = 'all 0.3s ease-in-out'
    }

    const remValue = `${rangeInput}rem`
    // YouTube comments are a bit more squished than normal paragraphs,
    // so we'll increase the line height by a greater factor.
    const heightFactor = 1.5
    const youTubeRemValue = `${rangeInput * heightFactor}rem`

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
            adjustStyle(comment, youTubeRemValue)
        }
    }
}

function showSliderValue() {
    const rangeBullet = document.getElementById("rs-bullet");
    const bgText = document.querySelector(".container");
    const movingColorHSL = `hsl(${rangeInput.value * 8}, 100%, 50%)`

    rangeBullet.innerHTML = rangeInput.value;
    const bulletPosition = (rangeInput.value / rangeInput.max) * 7;
    rangeBullet.style.left = `${bulletPosition}rem`;

    bgText.style.color = movingColorHSL;
    rangeBullet.style.color = movingColorHSL;
}


// Initialize button with user's preferred line height.
let rangeInput = document.getElementById("line-height-range")

rangeInput.addEventListener("input", showSliderValue, false);
rangeInput.addEventListener("mouseup", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    let value = document.getElementById("line-height-range").value
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setLineHeight,
        args: [value],
    });
});