export {initColors};

function getCards() {
    return document.querySelectorAll('.card').values().toArray();
}

/* ========== Exported functions ========== */

function initColors(primaryColor, secondaryColor) {
    getCards().forEach(c => c.style.backgroundColor = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.8)`);

    createScrollbarStyle(primaryColor);

    setSocialMediaColor(primaryColor, secondaryColor);
}

/* ======== Exported functions end ======== */

/* ========== Internal functions ========== */

function adjustBrightness(color, percent) {
    // Ensure the percent is in decimal form
    let factor = percent / 100;

    return {
        r: Math.min(255, Math.max(0, Math.round(color.r + color.r * factor))),
        g: Math.min(255, Math.max(0, Math.round(color.g + color.g * factor))),
        b: Math.min(255, Math.max(0, Math.round(color.b + color.b * factor)))
    };
}

function setSocialMediaColor(primaryColor, secondaryColor) {
    primaryColor = adjustBrightness(primaryColor, 20);
    secondaryColor = adjustBrightness(secondaryColor, 20);

    const styleElement = document.createElement('style');
    styleElement.innerHTML = `.social-media a::after { background: linear-gradient(-45deg, rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 1), rgba(${secondaryColor.r}, ${secondaryColor.g}, ${secondaryColor.b}, 1)); }`;
    document.head.appendChild(styleElement);
}

function createScrollbarStyle(color) {
    const darkColor = adjustBrightness(color, -50);

    const style = document.createElement('style');
    style.innerHTML = `
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: rgba(${darkColor.r}, ${darkColor.g}, ${darkColor.b}, 0.8);
            border-radius: 8px;
        }
        ::-webkit-scrollbar-thumb {
            background: #A6A6A6;
            border-radius: 8px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #CDCDCD;
        }
    `;
    document.head.appendChild(style);
}

function init() {
    getCards().forEach(c => c.addEventListener('click', () => onClickOnCard(c)));

    setupTopBars();

    setupCloseButtons();
}

function setupTopBars() {
    getCards().forEach(card => {
        const topBar = document.createElement('div');
        topBar.classList.add('top-bar')

        const closeButton = document.createElement('div');
        closeButton.innerText = '×'
        closeButton.classList.add('close-button');

        topBar.appendChild(closeButton);
        card.insertBefore(topBar, card.firstChild)
    })
}

function setupCloseButtons() {
    document.querySelectorAll('.close-button').forEach(closeButton => closeButton.addEventListener('click', (evt) => {
        evt.stopPropagation();
        closeCard(closeButton.parentElement /* <= Top bar */.parentElement /* <= Card */.parentElement /* <= Card holder */);
        removeDisabledFromCardHolders();
    }));
}

function onClickOnCard(currentCard) {
    const currentCardHolder = currentCard.parentElement;

    if (!isCardOpened(currentCardHolder)) {
        for (let card of getCards().values().filter(c => c !== currentCard)) {
            const cardHolder = card.parentElement;
            cardHolder.classList.add(currentCardHolder.classList.contains('top') ? 'disabled-from-top' : 'disabled-from-bottom');
        }
        openCard(currentCardHolder);
    }
}

function removeDisabledFromCardHolders() {
    for (let cardHolder of document.querySelectorAll('.card-holder')) {
        cardHolder.classList.remove('disabled-from-top');
        cardHolder.classList.remove('disabled-from-bottom');
    }
}

function isCardOpened(cardHolder) {
    return cardHolder.classList.contains('opened');
}

function closeCard(cardHolder) {
    cardHolder.classList.remove('opened');
}

function openCard(cardHolder) {
    cardHolder.classList.add('opened');
}

init();
