let seconds = 0;
let minutes = 0;
let interval = null;
let clicks = 0;

const cards = [
    'docs/image/img0.jpg', 'docs/image/img0.jpg', 
    'docs/image/img1.jpg', 'docs/image/img1.jpg', 
    'docs/image/img2.jpg', 'docs/image/img2.jpg', 
    'docs/image/img3.png', 'docs/image/img3.png', 
    'docs/image/img4.jpg', 'docs/image/img4.jpg', 
    'docs/image/img5.jpg', 'docs/image/img5.jpg', 
    'docs/image/img6.jpg', 'docs/image/img6.jpg', 
    'docs/image/img7.jpg', 'docs/image/img7.jpg'
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateCardElement(cardSrc) {
    const td = document.createElement('td');
    const div = document.createElement('div');
    div.classList.add('card');
    
    const imgBack = document.createElement('img');
    imgBack.src = './image/img4.jpg';  // Image de dos
    imgBack.classList.add('card-back');
    
    const imgFront = document.createElement('img');
    imgFront.src = cardSrc;  // Image de face
    imgFront.classList.add('card-front');
    imgFront.style.display = 'none';
    
    div.appendChild(imgBack);
    div.appendChild(imgFront);
    td.appendChild(div);
    
    td.addEventListener('click', flipCard);
    return td;
}

function startGame() {
    clicks = 0;
    document.getElementById("clicks").textContent = clicks;
    
    const shuffledCards = shuffle(cards);
    const tableBody = document.getElementById('card-table');
    tableBody.innerHTML = ''; 
    
    let row;
    shuffledCards.forEach((cardSrc, index) => {
        if (index % 4 === 0) {
            row = document.createElement('tr');
            tableBody.appendChild(row);
        }
        row.appendChild(generateCardElement(cardSrc));
    });
}

// Fonction temps
function startTimer() {
    interval = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        document.getElementById("timer").textContent = formatTime(minutes, seconds);
    }, 1000);
}

function formatTime(min, sec) {
    return (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
}

// Flip cards
function flipCard(event) {
    if (lockBoard) return;
    const card = event.currentTarget.querySelector('.card');
    const cardBack = card.querySelector('.card-back');
    const cardFront = card.querySelector('.card-front');
    
    if (cardFront.style.display === 'none') {
        cardBack.style.display = 'none';
        cardFront.style.display = 'block';

        if (!firstCard) {
            firstCard = cardFront;
            clicks++;
            document.getElementById("clicks").textContent = clicks;
        } else {
            secondCard = cardFront;
            clicks++;
            document.getElementById("clicks").textContent = clicks;
            checkForMatch();
        }
    }
}

function checkForMatch() {
    lockBoard = true;
    
    if (firstCard.src === secondCard.src) {
        resetBoard();
    } else {
        setTimeout(() => {
            firstCard.parentElement.querySelector('.card-back').style.display = 'block';
            firstCard.style.display = 'none';
            secondCard.parentElement.querySelector('.card-back').style.display = 'block';
            secondCard.style.display = 'none';
            resetBoard();
        }, 1000);
    }
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

// Start et Click
document.getElementById("start").addEventListener("click", () => {
    if (!interval) {
        startTimer();
    }
    startGame();
});

document.getElementById("reset").addEventListener("click", () => {
    clearInterval(interval);
    interval = null;
    seconds = 0;
    minutes = 0;
    clicks = 0;
    document.getElementById("timer").textContent = "00:00";
    document.getElementById("clicks").textContent = clicks;
    
    document.querySelectorAll('.card').forEach(card => {
        card.querySelector('.card-back').style.display = 'block';
        card.querySelector('.card-front').style.display = 'none';
    });

    startGame();
});

// Reinitialisé le jeu
startGame();