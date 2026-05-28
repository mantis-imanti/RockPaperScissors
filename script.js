const URL = "https://teachablemachine.withgoogle.com/models/sBS7rUq_0/";

let model, webcam;

async function init() {

  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);

  webcam = new tmImage.Webcam(400, 400, true);

  await webcam.setup();
  await webcam.play();

  document.getElementById("webcam-container")
    .appendChild(webcam.canvas);

  window.requestAnimationFrame(loop);
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
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
    document.getElementById("label-container").innerHTML =
      `Detectado: ${best.className}`;
  }
}