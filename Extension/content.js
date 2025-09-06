console.log("Content script loaded");

function getContent() {
    // Correct way: array of multiple selectors
     const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];

    for (const select of selectors) {
        const contentData = document.querySelector(select);
        if (contentData != null) {
            return contentData.innerText.trim();
        }
    }
    return '';
}

function createButton() {
    const button = document.createElement('div');
    button.innerHTML = "AI Reply"; // Correct usage
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3'; // Gmail style
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate Your Reply');
button.style.marginRight = '8px';
    return button;
}

function getToolbar() {
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];

    for (const select of selectors) {
        const toolbar = document.querySelector(select);
        if (toolbar) return toolbar;
    }
    return null;
}

function injectButton() {
    const existButton = document.querySelector('.aireply');
    if (existButton) existButton.remove();

    const toolbar = getToolbar();
    if (toolbar == null) {
        console.log("No toolbar found");
        return;
    }

    console.log("Found the toolbar. Now injecting the button");
    const button = createButton();
    button.classList.add('aireply');

    button.addEventListener('click', async () => {
        try {
            button.innerHTML = 'Generating Reply...';
            button.style.pointerEvents = 'none'; // disable temporarily

            const getContentData = getContent();
            if (!getContentData) {
                alert("No email content found to generate a reply.");
                button.innerHTML = 'AI Reply';
                button.style.pointerEvents = 'auto';
                return;
            }

            const createResponse = await fetch("http://localhost:8080/api/emails/generate", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                emailContent: getContentData,
                emailTone: "professional"
})

            });

            if (!createResponse.ok) {
                console.log("Error fetching reply");
                alert("Failed to generate reply.");
                return;
            }

            const responseText = await createResponse.text();
            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, responseText);
            } else {
                console.error('Compose box was not found');
            }

        } catch (error) {
            console.error(error);
            alert('Failed to generate reply');
        } finally {
            button.innerHTML = 'AI Reply';
            button.style.pointerEvents = 'auto';
        }
    });

    // Correct insertion of button
    toolbar.insertBefore(button, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {
    for (const mutates of mutations) {
        const addedNodes = Array.from(mutates.addedNodes);
        const hasCompose = addedNodes.find(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.ip.adB,.aoI,.btC') || node.querySelector('.ip.adB,.aoI,.btC'))
        );

        if (hasCompose) {
            console.log("Compose window detected");
            setTimeout(injectButton, 500);
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });
