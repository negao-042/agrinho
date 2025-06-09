let veiculo;
let pontosDeEntrega = [];
let conectividade = 0;

let tempoTotal = 60; // segundos
let tempoRestante;
let jogoAtivo = true;

let arvores = []; // array para guardar as posições das árvores

function setup() {
  createCanvas(800, 400);
  veiculo = new Veiculo();
  gerarPontos();
  gerarArvores();
  tempoRestante = tempoTotal;
  frameRate(60);
}

function draw() {
  background(135, 206, 235); // céu azul

  drawCidade();
  drawCampo();

  // Texto informativo
  fill(0);
  textSize(20);
  text("🏙️ Cidade", 20, 30);
  text("🌾 Campo", width - 120, 30);
  textSize(16);
  text("📶 Conectividade: " + conectividade + " / 10", width / 2 - 80, 30);

  // Mostrar tempo
  textSize(20);
  fill(255, 0, 0);
  text("⏳ Tempo: " + nf(tempoRestante, 2, 1) + "s", width / 2 - 60, 60);

  if (jogoAtivo) {
    // Atualizar veículo
    veiculo.move();
    veiculo.display();

    // Mostrar pontos de entrega
    for (let i = pontosDeEntrega.length - 1; i >= 0; i--) {
      pontosDeEntrega[i].display();

      if (veiculo.entregar(pontosDeEntrega[i])) {
        conectividade++;
        pontosDeEntrega.splice(i, 1);
      }
    }

    // Atualizar tempo
    if (frameCount % 60 == 0 && tempoRestante > 0) {
      tempoRestante -= 1;
    }

    // Verificar vitória
    if (conectividade >= 10) {
      fimDeJogo(true);
    }

    // Verificar tempo esgotado
    if (tempoRestante <= 0 && conectividade < 10) {
      fimDeJogo(false);
    }
  }
}

function fimDeJogo(vitoria) {
  jogoAtivo = false;
  noLoop();
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  if (vitoria) {
    text("🌐 Conexão estabelecida com sucesso!", width / 2, height / 2);
  } else {
    text("⏰ Tempo esgotado! Você perdeu!", width / 2, height / 2);
  }
}

// Desenha a cidade com prédios e ruas
function drawCidade() {
  // Chão asfalto
  noStroke();
  fill(60);
  rect(0, height * 0.3, width / 2, height * 0.7);

  // Estrada
  fill(80);
  rect(0, height * 0.55, width / 2, 60);
  stroke(255, 255, 0);
  strokeWeight(4);
  for (let x = 0; x < width / 2; x += 40) {
    line(x, height * 0.55 + 30, x + 20, height * 0.55 + 30);
  }

  // Prédios
  noStroke();
  let buildingColors = [
    color(70, 70, 120),
    color(90, 90, 150),
    color(50, 50, 100),
    color(80, 80, 130),
  ];
  for (let i = 0; i < 7; i++) {
    let bw = 40;
    let bh = (100, 200);
    let bx = i * 50 + 20;
    let by = height * 0.3 + 120 - bh;
    fill(buildingColors[i % buildingColors.length]);
    rect(bx, by, bw, bh, 5);

    // Janelas
    fill(255, 255, 150, 200);
    for (let wy = by + 10; wy < by + bh - 10; wy += 20) {
      for (let wx = bx + 8; wx < bx + bw - 8; wx += 15) {
        if (random() > 0.5) {
          rect(wx, wy, 8, 12);
          
        }
      }
    }
  }

  // Postes de luz na estrada
  stroke(255, 255, 150);
  strokeWeight(3);
  for (let px = 20; px < width / 2; px += 100) {
    line(px, height * 0.55, px, height * 0.55 - 40);
    ellipse(px, height * 0.55 - 40, 12, 12);
  }
}

// Desenha o campo com árvores, grama e cerca
function drawCampo() {
  // Grama
  noStroke();
  fill(34, 139, 34);
  rect(width / 2, height * 0.3, width / 2, height * 0.7);

  // Textura de grama
  stroke(20, 100, 20);
  for (let i = width / 2; i < width; i += 10) {
    for (let j = height * 0.3; j < height; j += 15) {
      line(i, j, i + 5, j + 10);
      line(i + 5, j + 10, i + 10, j);
    }
  }
  noStroke();

  // Cerca simples
  stroke(139, 69, 19);
  strokeWeight(4);
  for (let x = width / 2 + 10; x < width - 20; x += 30) {
    line(x, height * 0.6, x, height * 0.75);
  }
  strokeWeight(6);
  line(width / 2 + 10, height * 0.6, width - 20, height * 0.6);
  line(width / 2 + 10, height * 0.75, width - 20, height * 0.75);
  noStroke();

  // Desenhar árvores do array
  for (let pos of arvores) {
    desenharArvore(pos.x, pos.y);
  }
}

// Função para desenhar árvore simples
function desenharArvore(x, y) {
  // Tronco
  fill(101, 67, 33);
  rect(x - 5, y + 20, 10, 20);
  // Copa
  fill(34, 139, 34);
  ellipse(x, y, 40, 50);
  fill(0, 100, 0);
  ellipse(x - 10, y + 10, 25, 30);
  ellipse(x + 10, y + 10, 25, 30);
}

// Gerar pontos aleatórios no campo
function gerarPontos() {
  pontosDeEntrega = [];
  for (let i = 0; i < 10; i++) {
    let x = random(width / 2 + 50, width - 50);
    let y = random(80, height - 50);
    pontosDeEntrega.push(new PontoDeEntrega(x, y));
  }
}

// Gerar posições das árvores uma vez só
function gerarArvores() {
  arvores = [];
  for (let i = 0; i < 7; i++) {
    let tx = random(width / 2 + 30, width - 40);
    let ty = random(height * 0.3 + 40, height * 0.75 - 40);
    arvores.push({ x: tx, y: ty });
  }
}

// Classe do Veículo
class Veiculo {
  constructor() {
    this.x = 50;
    this.y = height / 2;
    this.size = 30;
    this.speed = 4;
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) this.x -= this.speed;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.speed;
    if (keyIsDown(UP_ARROW)) this.y -= this.speed;
    if (keyIsDown(DOWN_ARROW)) this.y += this.speed;

    // Limites da tela
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  display() {
    fill(0, 100, 255);
    rect(this.x, this.y, this.size, this.size, 5);
    fill(255);
    textSize(12);
    text("📡", this.x + 5, this.y + 20);
  }

  entregar(ponto) {
    let d = dist(this.x, this.y, ponto.x, ponto.y);
    return d < this.size;
  }
}

// Classe dos pontos de entrega
class PontoDeEntrega {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
  }

  display() {
    fill(255, 255, 0);
    ellipse(this.x, this.y, this.size);
    fill(0);
    textSize(12);
    textAlign(CENTER);
    text("📶", this.x, this.y + 4);
  }
}
