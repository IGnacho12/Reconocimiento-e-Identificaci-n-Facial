import { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import { write } from "@/localStorage";

export default function RegisterFace() {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("Cargando cámara...");
  const [faces, setFaces] = useState([]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        setStatus("Apunta tu rostro y presiona capturar");
      } catch {
        setStatus("Error al acceder a la cámara");
      }
    };
    startCamera();
  }, []);

  const captureFace = async () => {
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) return setStatus("No se detectó ningún rostro");

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    const image = canvas.toDataURL("image/png");

    const newFace = { id: Date.now(), path: image, descriptor: detection.descriptor };
    setFaces((prev) => [...prev, newFace]);
    write([...faces, newFace]);
    setStatus("Rostro registrado correctamente");
  };

  return (
    <section className="flex flex-col items-center gap-3 p-4">
      <video ref={videoRef} autoPlay muted className="w-72 h-56 rounded-xl shadow" />
      <button
        onClick={captureFace}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
      >
        Capturar rostro
      </button>
      <p className="text-sm text-gray-600">{status}</p>
    </section>
  )
