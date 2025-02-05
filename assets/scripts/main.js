export { setCardsColor };

function getCards() {
    return document.querySelectorAll('#card-container > .card-holder > .card').values().toArray();
}

/* ========== Exported functions ========== */

function setCardsColor(color) {
    getCards().forEach(c => c.style.backgroundColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`);
}

/* ======== Exported functions end ======== */

/* ========== Internal functions ========== */

function init() {
    getCards().forEach(c => c.parentElement.addEventListener('click', () => openCard(c)));
}

function openCard(currentCard) {
    const cardHolder = currentCard.parentElement;
    const isOpen = currentCard.classList.contains('card-open');

    if (isOpen) {
        currentCard.classList.remove('card-open');
        cardHolder.classList.remove('card-open');
        getCards().forEach(c => c.parentElement.classList.remove('disabled'));
    } else {
        for (let card of getCards().values().filter(c => c !== currentCard)) {
            const cardHolder = card.parentElement;
            cardHolder.classList.add('disabled');
        }
        currentCard.classList.add('card-open');
        cardHolder.classList.add('card-open');
    }
}

init();
