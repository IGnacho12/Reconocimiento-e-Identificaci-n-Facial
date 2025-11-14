import { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { useCamera } from "@/hooks/useCamera";
import { read, write } from "@/localStorage";
import useFetch from "../hooks/useFetch";

import "../App.css";

import RegisterFaceCard from "@/components/registerFace";
import BotonGuardar from "@/components/botonGuardar";

export default function Test() {
  const { data: response } = useFetch("https://pig-edev.vercel.app/api/alumnos/obtener");

  const videoRef = useCamera();
  const canvasRef = useRef(null);

  const [images, setImages] = useState([]);
  const [faceMatcher, setFaceMatcher] = useState(null);

  // ============================
  // 1) Cargar modelos de face-api
  // ============================
  const loadModels = async () => {
    const URL = "/data/models"; // asegúrate que exista
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(URL)
    ]);
  };

  // ============================
  // 2) Dibujar la cámara en canvas
  // ============================
  useEffect(() => {
    const draw = () => {
      if (videoRef.current && canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0, 1280, 800);
      }
      requestAnimationFrame(draw);
    };
    draw();
  }, [videoRef]);

  // ======================================================
  // 3) Cuando llegan alumnos → setImages + generar descriptores
  // ======================================================
  useEffect(() => {
    if (!response || !Array.isArray(response)) return;

    const adaptados = response.map(a => ({
      id: a.id_estudiante,
      name: a.nombre,
      dni: a.dni,
      path: a.avatar,
      cursoYDivision: a.curso_y_division,
      selected: false
    }));

    setImages(adaptados);

    const procesar = async () => {
      await loadModels();

      const saved = read("descriptors") || {};

      for (const alumno of adaptados) {
        if (!alumno.path) continue;
        if (saved[alumno.id]) continue;

        try {
          const img = await faceapi.fetchImage(alumno.path);
          const det = await faceapi
            .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (det?.descriptor) {
            saved[alumno.id] = Array.from(det.descriptor);
            console.log("Descriptor generado:", alumno.name);
          } else {
            console.warn("No se encontró cara en avatar:", alumno.name);
          }
        } catch (err) {
          console.error("ERROR avatar de", alumno.name, err);
        }
      }

      write("descriptors", saved);

      // Construimos el FaceMatcher
      const labeled = Object.entries(saved).map(([id, desc]) =>
        new faceapi.LabeledFaceDescriptors(id.toString(), [
          Float32Array.from(desc)
        ])
      );

      setFaceMatcher(new faceapi.FaceMatcher(labeled, 0.6));
    };

    procesar();
  }, [response]);

  // ======================================================
  // 4) Detección en vivo
  // ======================================================
  useEffect(() => {
    if (!faceMatcher) return;

    const UMBRAL = 0.45;

    const interval = setInterval(async () => {
      if (!canvasRef.current) return;

      const det = await faceapi
        .detectSingleFace(canvasRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!det) return;

      const match = faceMatcher.findBestMatch(det.descriptor);

      if (match.label !== "unknown" && match.distance <= UMBRAL) {
        const alumnoId = match.label;
        const alumno = images.find(i => i.id.toString() === alumnoId);

        if (alumno) {
          console.log("RECONOCIDO:", alumno.name, " | distancia:", match.distance);

          setImages(prev =>
            prev.map(img => ({
              ...img,
              selected: img.id.toString() === alumnoId
            }))
          );
        }
      } else {
        setImages(prev =>
          prev.map(img => ({ ...img, selected: false }))
        );
      }
    }, 900);

    return () => clearInterval(interval);
  }, [faceMatcher, images]);

  async function tomarAsistencia() {
    const alumnoSeleccionado = images.find(img => img.selected);

    if (!alumnoSeleccionado) {
      console.warn("No hay ningún alumno detectado.");
      return;
    }

    const id = alumnoSeleccionado.id;

    console.log("Enviando asistencia para ID:", id);

    try {
      const res = await fetch(
        `https://pig-edev.vercel.app/api/alumnos/asistencia/registrarPorIdDeEstudiante?id_estudiante=${id}`,
        {
          method: "GET"
        }
      );

      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status}`);
      }

      const data = await res.json();
      console.log("Guardado OK:", data);

      // ejemplo: mostrar un feedback en pantalla
      // setMensaje("Asistencia guardada correctamente");
    } catch (err) {
      console.error("Error guardando asistencia:", err);
    }
  }

  return (
    <main className="grid grid-cols-[320px_1fr] h-screen text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="flex flex-col gap-3 p-4 border-r border-gray-300/30 dark:border-gray-600/30 overflow-y-auto bg-white">
        <header className="mb-2">
          <h2 className="text-lg font-semibold">Alumnos registrados</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Lista de alumnos con reconocimiento facial
          </p>
        </header>

        {images.map(alumno => (
          <RegisterFaceCard
            key={alumno.id}
            nombre={alumno.name}
            id={alumno.id}
            path={alumno.path}
            cursoYDivision={alumno.cursoYDivision}
            selected={alumno.selected}
          />
        ))}
      </aside>

      {/* Sección principal */}
      <section className="flex flex-col items-center overflow-y-auto">
        <h2 className="text-2xl font-bold mt-2">Alumno detectado</h2>

        <section className="flex justify-center bg-white">
          {images.some(img => img.selected)
            ? images
              .filter(img => img.selected)
              .map(img => (
                <RegisterFaceCard
                  key={img.id}
                  nombre={img.name}
                  id={img.id}
                  path={img.path}
                  cursoYDivision={img.cursoYDivision}
                  selected={true}

                  className="w-2/7"
                />
              ))
            : (
              <RegisterFaceCard
                nombre="??"
                dni="???"
                cursoYDivision="??"
                className="w-2/7"
              />
            )}
        </section>

        <div className="relative flex justify-center w-full max-w-4xl py-2">
          <canvas
            ref={canvasRef}
            width={1280}
            height={800}
            className="w-full max-w-lg rounded-2xl scale-x-[-1] "
          />
          <video ref={videoRef} autoPlay className="hidden" />
        </div>

        <div className="py-4">
          <BotonGuardar alHacerClick={tomarAsistencia} >Tomar asistencia!</BotonGuardar>
        </div>
      </section>
    </main>
  );
}
