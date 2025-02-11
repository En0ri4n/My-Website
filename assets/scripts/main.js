export {initColors, getLineColor, getDotColor, hexToRgb};

/* ========== Exported functions ========== */

const matchingColors = [
    ['#EEBD89', '#D13ABD'],
    ['#9600FF', '#AEBAF8'],
    ['#849B5C', '#BFFFC7'],
    ['#BB73E0', '#FF8DDB'],
    ['#0CCDA3', '#C1FCD3'],
    ['#C973FF', '#AEBAF8'],
    ['#F9957F', '#F2F5D0'],
    ['#B60F46', '#D592FF'],
    ['#A3C9E2', '#9618F7'],
    ['#CD005F', '#F6EFA7'],
]

let randomColorIndex = getRandomColorIndex();

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.substring(1, hex.length), 16);
    return {r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255};
}

function getRandomColorIndex() {
    return Math.floor(Math.random() * matchingColors.length);
}

function initColors(primaryColor, secondaryColor) {
    setCardsColor(primaryColor, secondaryColor);

    createScrollbarStyle(primaryColor);

    setSocialMediaColor(primaryColor, secondaryColor);
}

function getLineColor() {
    return matchingColors[randomColorIndex][0];
}

function getDotColor() {
    return matchingColors[randomColorIndex][1];
}

/* ======== Exported functions end ======== */

/* ========== Internal functions ========== */

function getCards() {
    return document.querySelectorAll('.card').values().toArray();
}

function adjustBrightness(color, percent) {
    // Ensure the percent is in decimal form
    let factor = percent / 100;

    return {
        r: Math.min(255, Math.max(0, Math.round(color.r + color.r * factor))),
        g: Math.min(255, Math.max(0, Math.round(color.g + color.g * factor))),
        b: Math.min(255, Math.max(0, Math.round(color.b + color.b * factor)))
    };
}

function setCardsColor(primaryColor, secondaryColor) {
    primaryColor = adjustBrightness(primaryColor, -20);
    getCards().forEach(c => c.style.backgroundColor = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.9)`);

    secondaryColor = adjustBrightness(secondaryColor, -20);
    document.querySelectorAll('#card-portfolio > .project > .project-row p a').forEach(a =>
    {
        a.style.color = `rgba(${secondaryColor.r}, ${secondaryColor.g}, ${secondaryColor.b}, 1)`
    });
}

function setSocialMediaColor(primaryColor, secondaryColor) {
    primaryColor = adjustBrightness(primaryColor, 20);
    secondaryColor = adjustBrightness(secondaryColor, 20);

    if (document.getElementById('social-media-color')) {
        document.getElementById('social-media-color').remove();
    }

    const styleElement = document.createElement('style');
    styleElement.id = 'social-media-color';
    styleElement.innerHTML = `.social-media a::after { background: linear-gradient(-45deg, rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 1), rgba(${secondaryColor.r}, ${secondaryColor.g}, ${secondaryColor.b}, 1)); }`;
    document.head.appendChild(styleElement);
}

function createScrollbarStyle(color) {
    const darkColor = adjustBrightness(color, -50);

    if (document.getElementById('scrollbar-style')) {
        document.getElementById('scrollbar-style').remove();
    }

    const style = document.createElement('style');
    style.id = 'scrollbar-style';
    style.innerHTML = `
        ::-webkit-scrollbar {
            width: 8px;
            transition: all ease-in-out 0.5s;
        }
        ::-webkit-scrollbar-track {
            background: rgba(${darkColor.r}, ${darkColor.g}, ${darkColor.b}, 0.8);
            border-radius: 8px;
            transition: all ease-in-out 0.5s;
        }
        ::-webkit-scrollbar-thumb {
            background: #A6A6A6;
            border-radius: 8px;
            transition: all ease-in-out 0.5s;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #CDCDCD;
            transition: all ease-in-out 0.5s;
        }
    `;
    document.head.appendChild(style);
}

function init() {
    getCards().forEach(c => c.addEventListener('click', () => onClickOnCard(c)));

    setupTopBars();

    setupCloseButtons();

    initializeClickables();

    initializeZoomableImages();

    setupChangeColorButton();
}

function setupChangeColorButton() {
    const changeColorButton = document.querySelector('#change-color');
    changeColorButton.addEventListener('click', () => {
        randomColorIndex = getRandomColorIndex();

        initColors(hexToRgb(getLineColor()), hexToRgb(getDotColor()));
    });
}

function initializeZoomableImages() {
    const zoomableImageContainer = document.querySelector('#zoomable-image-container');
    zoomableImageContainer.addEventListener('click', () => zoomableImageContainer.style.display = 'none');

    const zoomableImage = zoomableImageContainer.querySelector('img');

    document.querySelectorAll('.zoomable').forEach(clickedZoomable =>
        clickedZoomable.addEventListener('click', (evt) =>
    {
        evt.stopPropagation();
        zoomableImage.src = clickedZoomable.src;
        zoomableImageContainer.style.display = 'flex';
    }));
}

function initializeClickables() {
    document.querySelectorAll('.clickable').forEach(clickable => clickable.addEventListener('click', (evt) =>
    {
        evt.stopPropagation();
        window.open(clickable.getAttribute('clickable-href'), '_blank');
    }));
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

/* ======== Internal functions end ======== */

init();
