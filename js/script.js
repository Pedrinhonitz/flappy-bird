var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var bird = new Image();
bird.src = "./img/bird.png";
var bg = new Image();
bg.src = "./img/bg3.png";
var chao = new Image();
chao.src = "./img/chao2.png";
var canoCima = new Image();
canoCima.src = "./img/canocima.png";
var canoBaixo = new Image();
canoBaixo.src = "./img/canobaixo.png";

var constante;
var bX = 33;
var bY = 200;
var gravidade = 1.4;
var score = 0;
var cano = [];
var eec;
var canoSpeed;
var espaçamentoHorizontal;

document.querySelectorAll('.difficulty-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.difficulty-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');
    });
});

function getSelectedDifficulty() {
    const buttons = document.querySelectorAll('.difficulty-button');
    for(const button of buttons) {
        if(button.classList.contains('selected')) {
            return button.id.replace('-button', '');
        }
    }
    return null;
}

document.getElementById("easy-button").classList.add('selected');

cano[0] = {
    x: canvas.width,
    y: Math.floor(Math.random() * canoCima.height) - canoCima.height
};

var fly = new Audio();
fly.src = "./sounds/fly.mp3";
var scor = new Audio();
scor.src = "./sounds/score.mp3";
var fail = new Audio();
fail.src = "./sounds/fail.mp3";

document.getElementById("start-button").addEventListener("click", startGame);
document.getElementById("restart-button").addEventListener("click", restartGame);

function showScreen(screenId) {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-over-screen").style.display = "none";
    document.getElementById(screenId).style.display = "flex";
}

// Inicia o jogo
function startGame() {
    showScreen("game-container");
    var dificuldade = getSelectedDifficulty();
    console.log(dificuldade);

    if(dificuldade === 'easy') {
        eec = 140;
        canoSpeed = 1;
        espaçamentoHorizontal = 200; 
    } else if(dificuldade === 'medium') {
        eec = 120;
        canoSpeed = 2;
        espaçamentoHorizontal = 180;
    } else if(dificuldade === 'hard') {
        eec = 100;
        canoSpeed = 3;
        espaçamentoHorizontal = 160;
    }

    jogo(eec, canoSpeed);
}

function restartGame() {
    showScreen("game-container");
    resetGame();
    jogo(eec, canoSpeed);
}

function resetGame() {
    bX = 33;
    bY = 200;
    gravidade = 1.4;
    score = 0;
    cano = [];
    cano[0] = {
        x: canvas.width,
        y: Math.floor(Math.random() * canoCima.height) - canoCima.height
    };
}

function voa() {
    bY -= 26;
    fly.play();
}

function jogo(eec, canoSpeed) {
    ctx.drawImage(bg, 0, 0);
    var hit = false;

    constante = canoCima.height + eec;

    for(let i = 0; i < cano.length; i++) {
        ctx.drawImage(canoCima, cano[i].x, cano[i].y);
        ctx.drawImage(canoBaixo, cano[i].x, cano[i].y + constante);
        cano[i].x -= canoSpeed;

        if(cano[i].x + canoCima.width < 0) {
            cano.shift();
            score++;
            scor.play();
        }

        if(cano.length > 0 && cano[cano.length - 1].x < canvas.width - espaçamentoHorizontal) {
            cano.push({
                x: canvas.width,
                y: Math.floor(Math.random() * canoCima.height) - canoCima.height
            });
        }

        if(bX + bird.width >= cano[i].x && bX <= cano[i].x + canoCima.width
            && (bY <= cano[i].y + canoCima.height || bY + bird.height >= cano[i].y + constante)
            || bY + bird.height >= canvas.height - chao.height) {
            hit = true;
        }
    }

    if (hit) {
        gameOver();
        return;
    }

    ctx.drawImage(chao, 0, canvas.height - chao.height);
    ctx.drawImage(bird, bX, bY);
    bY += gravidade;
    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Pontos: " + score, 10, canvas.height - 20);
    requestAnimationFrame(() => jogo(eec, canoSpeed));
}

function gameOver() {
    document.getElementById("final-score").textContent = score;
    showScreen("game-over-screen");
}

document.addEventListener("keydown", function(event) {
    if(event.code === "Space") {
        voa();
    }
});

showScreen("start-screen");
