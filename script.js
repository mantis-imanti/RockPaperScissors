const URL =
"https://teachablemachine.withgoogle.com/models/sBS7rUq_0/";


let model, webcam, maxPredictions;


async function init() {

  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(
    modelURL,
    metadataURL
  );

  maxPredictions = model.getTotalClasses();

  // Cámara
  webcam = new tmImage.Webcam(
    400,
    400,
    true
  );

  await webcam.setup();

  await webcam.play();

  window.requestAnimationFrame(loop);

  document
    .getElementById("webcam-container")
    .appendChild(webcam.canvas);
}


async function loop() {

  webcam.update();

  await predict();

  window.requestAnimationFrame(loop);
}


async function predict() {

  const prediction =
    await model.predict(webcam.canvas);

  let highest = prediction[0];

  prediction.forEach(p => {

    if (p.probability > highest.probability) {
      highest = p;
    }

  });

  // Detectar jugada
  if (highest.probability > 0.95) {

    const playerMove =
      highest.className;

    document.getElementById(
      "prediction"
    ).innerHTML =
      `Tú: ${emoji(playerMove)}`;

    jugar(playerMove);

  }

}


function jugar(playerMove) {

  const opciones = [
    "Piedra",
    "Papel",
    "Tijeras"
  ];

  const computerMove =
    opciones[
      Math.floor(Math.random() * 3)
    ];

  document.getElementById(
    "computer"
  ).innerHTML =
    `CPU: ${emoji(computerMove)}`;

  let resultado = "";

  if (playerMove === computerMove) {

    resultado = "🤝 Empate";

  } else if (

    (playerMove === "Piedra" &&
      computerMove === "Tijeras")

    ||

    (playerMove === "Papel" &&
      computerMove === "Piedra")

    ||

    (playerMove === "Tijeras" &&
      computerMove === "Papel")

  ) {

    resultado = "🏆 Ganaste";

  } else {

    resultado = "💀 Perdiste";
  }

  document.getElementById(
    "result"
  ).innerHTML = resultado;
}


function emoji(move) {

  if (move === "Piedra")
    return "✊";

  if (move === "Papel")
    return "✋";

  if (move === "Tijeras")
    return "✌️";

  return move;
}