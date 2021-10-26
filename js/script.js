var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Carregando Imagens
// Carregando Passaro
var bird = new Image();
bird.src = "./img/bird.png";
// Carregando Background
var bg = new Image();
bg.src = "./img/bg3.png";
// Carregando Chão
var chao = new Image();
chao.src = "./img/chao2.png";
// Carregando o Cano parte de cima
var canoCima = new Image();
canoCima.src = "./img/canocima.png";
// Carregando o Cano parte de baixo
var canoBaixo = new Image();
canoBaixo.src = "./img/canobaixo.png";

// Variaveis

var eec = 100;
var constante;
var bX = 33;
var bY = 200;
var gravidade = 1.4;
var score = 0;
var cano = [];
var delay = 1000;

cano[0] = {
    x : canvas.width,
    y : 0
}

// Carregando os Sons
// Carregando o Som de voo
var fly = new Audio();
fly.src = "./sounds/fly.mp3";
// Carregando o Som de Pontos
var scor = new Audio();
scor.src = "./sounds/score.mp3";
// Carregando o Som de quando Perder
var fail = new Audio();
fail.src = "./sounds/fail.mp3";

// Capturando as Teclas
document.addEventListener("keydown", voa);

// Configurando o voo
function voa(){
    bY = bY - 26;
    fly.play();
}

function jogo(){
    // Configurando o Background
    // drawImage(image, X, Y)
    ctx.drawImage(bg,0,0);
    
    // Configurando os Canos do jogo
    for(let i = 0; i < cano.length; i++){
        // Posição do Cano de Baixo
        constante = canoCima.height + eec;
        // Configurando o Cano de Cima
        ctx.drawImage(canoCima, cano[i].x, cano[i].y);
        // Configurando o Cano de Baixo
        ctx.drawImage(canoBaixo, cano[i].x, cano[i].y+constante);
        // Movimentação do Cano
        cano[i].x = cano[i].x - 1;
        // Criando Cano Aleatoriamente
        if(cano[i].x == 125){
            cano.push({
                x : 350,
                y : Math.floor(Math.random()*canoCima.height)-canoCima.height
            });
        }
        // Verifica se o Passaro esta na borda dos canos, se ele colidiu com os canos ou se ele encostou no chão
        if(bX + bird.width >= cano[i].x && bX <= cano[i].x + canoCima.width
            && (bY <= cano[i].y + canoCima.height || bY+bird.height >= cano[i].y+constante)
            || bY + bird.height >= canvas.height - chao.height){
                fail.play();
                setTimeout(() => {
                    location.reload();
                }, 300);
            }
            // Marca os pontos
            if(cano[i].x == 5){
                score = score += 1;
                scor.play();
            }


    }
    
    // Desenhando o chão
    ctx.drawImage(chao,0,canvas.height - chao.height);
    
    // Desenhando o Passaro
    ctx.drawImage(bird,bX,bY);
    
    // Adicionando a Gravidade
    bY += gravidade;   
    // Criando o placar
    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";
    ctx.fillText("Pontos: " + score, 10, canvas.height-20);
    requestAnimationFrame(jogo);
}

jogo();