const URL = "https://teachablemachine.withgoogle.com/models/sBS7rUq_0/";

let model, webcam;
let playerMove = "";
let canPlay = true;

let scorePlayer = 0;
let scoreMachine = 0;

async function initCamera() {

  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);

  webcam = new tmImage.Webcam(400, 400, true);

  await webcam.setup();
  await webcam.play();

  document.getElementById("webcam-container")
    .appendChild(webcam.canvas);

  loop();
}

async function loop() {
  webcam.update();
  await predict();
  requestAnimationFrame(loop);
}

async function predict() {

  const prediction = await model.predict(webcam.canvas);

  let best = prediction[0];

  for (let p of prediction) {
    if (p.probability > best.probability) {
      best = p;
    }
  }

  if (best.probability > 0.90) {
    playerMove = best.className;

    document.getElementById("label-container").innerHTML =
      `Tú: ${emoji(playerMove)}`;
  }
}

function startGame() {

  if (!canPlay) return;

  canPlay = false;

  let count = 3;

  document.getElementById("result").innerHTML = "";
  document.getElementById("countdown").innerHTML = count;

  const interval = setInterval(() => {

    count--;

    if (count > 0) {
      document.getElementById("countdown").innerHTML = count;
    }

    if (count === 0) {
      clearInterval(interval);

      document.getElementById("countdown").innerHTML = "¡YA!";

      playRound();
    }

  }, 1000);
}

function playRound() {

  const options = ["Piedra", "Papel", "Tijeras"];

  const machineMove =
    options[Math.floor(Math.random() * 3)];

  let result = "";

  if (playerMove === machineMove) {
    result = "🤝 Empate";
  }
  else if (
    (playerMove === "Piedra" && machineMove === "Tijeras") ||
    (playerMove === "Papel" && machineMove === "Piedra") ||
    (playerMove === "Tijeras" && machineMove === "Papel")
  ) {
    result = "🏆 Tú ganas";
    scorePlayer++;
  }
  else {
    result = "💀 Máquina gana";
    scoreMachine++;
  }

  document.getElementById("result").innerHTML =
    `Máquina: ${emoji(machineMove)} <br><br> ${result}`;

  document.getElementById("score").innerHTML =
    `Tú: ${scorePlayer} | Máquina: ${scoreMachine}`;

  setTimeout(() => {
    canPlay = true;
    document.getElementById("countdown").innerHTML = "";
  }, 1500);
}

function emoji(move) {

  if (move === "Piedra") return "✊";
  if (move === "Papel") return "✋";
  if (move === "Tijeras") return "✌️";

  return move;
}

// IMPORTANTE: inicia cámara
initCamera();