import { initColors } from "./main.js";

const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.substring(1, hex.length), 16);
    return {r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255};
}

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

const randomColorIndex = Math.floor(Math.random() * matchingColors.length);

const lineColor = hexToRgb(matchingColors[randomColorIndex][0]);
const dotColor = matchingColors[randomColorIndex][1];

class Particle {
    constructor(x, y, directionX, directionY, size) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = dotColor;
        ctx.fill();
    }

    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 30000;
    for (let i = 0; i < numberOfParticles * 2; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);

        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        particlesArray.push(new Particle(x, y, directionX, directionY, size));
    }

    initColors(hexToRgb(matchingColors[randomColorIndex][0]), hexToRgb(matchingColors[randomColorIndex][1]));
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 50000);
                ctx.strokeStyle = `rgba(${lineColor.r}, ${lineColor.g}, ${lineColor.b}, ${opacityValue})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

window.addEventListener('resize', function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
})


init();
animate();

