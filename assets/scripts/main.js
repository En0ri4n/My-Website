export { setCardColor };

function setCardColor(color) {
    const cards = document.querySelectorAll('#card-container > .card-holder > .card');
    cards.forEach(c => c.style.backgroundColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`);
}
