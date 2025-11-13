import { useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import { useCamera } from "@/hooks/useCamera";
import { useFaceApi } from "@/hooks/useFaceApi";
import { read, write, destroy } from "@/localStorage";
import useFetch from "../hooks/useFetch";
import "../App.css";


import RegisterFaceCard from "@/components/registerFace"
import BotonGuardar from "@/components/botonGuardar"

export default function Test() {
  // Obtener todos los estudiantes de PIGE
  const { data: response } = useFetch("https://pig-edev.vercel.app/api/getStudents");
  const videoRef = useCamera();
  const canvasRef = useRef(null);
  const { faceMatcher, images, setImages, syncImages } = useFaceApi();

  // Dibujar cámara en canvas
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

  // Detección facial
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!canvasRef.current || !faceMatcher) return;

      const detection = await faceapi
        .detectSingleFace(
          canvasRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) return;
      // frame actual de la camraa
      const match = faceMatcher.findBestMatch(detection.descriptor); //  faceMatcher, almacena todos los rostros, findBestMatch, lograra que esta expresion retorne, aquel rostro de faceMatcher que se asemeje mas al, detection.descriptor
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          selected: match.label === img.id.toString(),
        }))
      );
    }, 1000);

    return () => clearInterval(interval); // Evita que se siga ejecutando si el componente se desmonta
  }, [faceMatcher, setImages]);




  // cuando llegan los alumnos, los pasamos al estado images
  useEffect(() => {
    if (response && Array.isArray(response)) {
      // adaptamos los datos al formato esperado por tu sistema local
      const adaptados = response.map(a => ({
        id: a.id_estudiante,
        name: a.nombre,
        dni: a.dni,
        path: a.avatar,
        cursoYDivision: a.curso_y_division,
        selected: false, // inicializamos
      }));
      setImages(adaptados);
    }
  }, [response, setImages]);

  return (
    <main className="grid grid-cols-[320px_1fr] h-screen  text-gray-900 dark:text-gray-100">
      {/* 🧾 Sidebar: Lista de alumnos */}
      <aside className="flex flex-col gap-3 p-4 border-r border-gray-300/30 dark:border-gray-600/30 overflow-y-auto">
        <header className="mb-2">
          <h2 className="text-lg font-semibold mb-1">Alumnos registrados</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Lista de alumnos con reconocimiento facial
          </p>
        
        </header>

        {/* Lista de RegisterFaceCard */}

        {response?.map((alumno) => (
          <RegisterFaceCard
            key={alumno.id_estudiante} // 👈 1. Propiedad 'key' añadida
            nombre={alumno.nombre} // 👈 2. Propiedad 'name' completada con datos
            id={alumno.id_estudiante}
            path={alumno.avatar}
            selected={alumno.selected}
          />
        ))}



      </aside>

      {/* 🎥 Sección principal: cámara + alumno activo */}
      <section className="flex flex-col items-center justify-start overflow-y-auto">
        <header className="w-full text-center">
          <h2 className="text-2xl font-bold">Alumno detectado</h2>

          <div className="flex justify-center">
            {images
              .filter((img) => img.selected)
              .map((img) => (
                <RegisterFaceCard
                  key={img.id}
                  nombre={img.name}
                  id={img.id}
                  path={img.path}
                  selected={img.selected}
                  onDelete={handleDelete}
                  className="w-2/7"
                />
              ))}

            {/* Si no hay elementos seleccionados (el array filtrado está vacío) */}
            {images.every(img => !img.selected) && <RegisterFaceCard
              nombre="??"
              dni="???"
              cursoYDivision="??"
              className="w-2/7"
            />}
          </div>
        </header>

        {/* Canvas de la cámara */}
        <div className="relative flex justify-center items-center w-full max-w-4xl py-2">
          <canvas
            ref={canvasRef}
            width={1280}
            height={800}
            className="w-full max-w-lg rounded-2xl scale-x-[-1]"
          />
          <video ref={videoRef} autoPlay className="hidden" />

          {/* Overlay opcional: texto o ícono */}
          {/* <span className="absolute text-gray-500 dark:text-gray-400 text-sm">Cámara activa...</span> */}
        </div>

        <div className="py-4">
          <BotonGuardar>Tomar asistencia!</BotonGuardar>
        </div>
      </section>
    </main>
  );
}
