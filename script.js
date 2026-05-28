async function init() {

  try {

    const stream =
      await navigator.mediaDevices.getUserMedia({
        video: true
      });

    const video =
      document.createElement("video");

    video.srcObject = stream;

    video.autoplay = true;

    video.playsInline = true;

    video.width = 400;

    document
      .getElementById("webcam-container")
      .appendChild(video);

  } catch (err) {

    console.error(err);

    alert(
      "No se pudo acceder a la cámara"
    );
  }
}
