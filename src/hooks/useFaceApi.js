import { useEffect, useState, useCallback } from "react";
import * as faceapi from "face-api.js";
import { read } from "@/localStorage";

export function useFaceApi() {
  const [faceMatcher, setFaceMatcher] = useState(null);
  const [images, setImages] = useState([]);

  const syncImages = useCallback(async () => {
    const stored = read();
    const descriptors = [];

    for (const img of stored) {
      const imageEl = new Image();
      imageEl.src = img.path;
      await imageEl.decode();

      const detection = await faceapi
        .detectSingleFace(imageEl, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection)
        descriptors.push({ id: img.id, descriptor: detection.descriptor });
    }

    const matcher =
      descriptors.length > 0
        ? new faceapi.FaceMatcher(
            descriptors.map(
              (d) =>
                new faceapi.LabeledFaceDescriptors(d.id.toString(), [d.descriptor])
            )
          )
        : null;

    setFaceMatcher(matcher);
    setImages(stored.map((img) => ({ ...img, selected: false })));
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/data/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      await syncImages();
    };
    loadModels();
  }, [syncImages]);

  return { faceMatcher, images, setImages, syncImages };
}


// useFaceApi()
// Hook que inicializa y gestiona FaceAPI.js para reconocimiento facial.
//
// - Carga los modelos de detección y reconocimiento.
// - Lee las imágenes almacenadas (por ejemplo en localStorage).
// - Genera descriptores faciales únicos de cada imagen.
// - Crea un FaceMatcher que permite comparar rostros en tiempo real.
//
// Retorna:
//   faceMatcher → objeto comparador de rostros
//   images      → imágenes guardadas con su estado
//   setImages   → función para actualizar manualmente las imágenes
//   syncImages  → fuerza una resincronización (por ejemplo, tras subir nuevas fotos)



// Face matcher, es el objeto que almacena todos los rostros con un id, y su represetancion matematica 

// const knownFaces = [
//   new faceapi.LabeledFaceDescriptors("1", [descriptorDeJuan]),
//   new faceapi.LabeledFaceDescriptors("2", [descriptorDeMaria]),
// ];

// const faceMatcher = new faceapi.FaceMatcher(knownFaces);