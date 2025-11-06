import { useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import { useCamera } from "@/hooks/useCamera";
import { useFaceApi } from "@/hooks/useFaceApi";
import { read, write, destroy } from "@/localStorage";
import "../App.css";

function Home() {
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

  // Subir imagen
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const id = Date.now();
    const url = URL.createObjectURL(file);
    write([...read(), { id, path: url, name: file.name }]);
    syncImages();
  };

  // Eliminar imagen
  const handleDelete = (id) => {
    destroy(id);
    syncImages();
  };

  return (
    <>
      <main className="flex flex-col md:flex-row h-screen w-screen bg-gray-50 p-6 gap-6">
        {/* Cámara */}
        <section className="flex-1 flex justify-center items-center bg-white rounded-2xl shadow-md p-4">
          <canvas
            ref={canvasRef}
            width={1280}
            height={800}
            className="w-full max-w-lg rounded-2xl"
          />
          <video ref={videoRef} autoPlay className="hidden" />
        </section>

        {/* Input + lista */}
        <section className="flex-1 flex flex-col items-center gap-4">
          <label className="flex flex-col items-center justify-center w-full max-w-md p-8 border-2 border-dashed rounded-2xl cursor-pointer hover:border-gray-400 transition-colors bg-white shadow-md">
            <span className="text-gray-700 mb-2 font-medium">
              Seleccionar imagen
            </span>
            <input type="file" className="hidden" onChange={handleFile} />
          </label>

          <div className="flex flex-wrap gap-4 justify-center w-full">
            {images.map((img) => (
              <div
                key={img.id}
                className={`flex flex-col items-center p-2 rounded-2xl ${
                  img.selected
                    ? "border-2 border-green-500"
                    : "border border-gray-200"
                }`}
              >
                <button
                  className="self-end text-red-500 font-bold"
                  onClick={() => handleDelete(img.id)}
                >
                  X
                </button>
                <img
                  src={img.path}
                  className="w-32 h-32 object-cover rounded-xl mt-2"
                />
                <span className="mt-1 text-gray-700">{img.name}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;

/*
const videoRef = useCamera(); -> Accede al video proporcionado por la cámara
const canvasRef = useRef(null); -> Referencia al elemento html donde se dibujara el stream de la cámara

const ctx = canvasRef.current.getContext("2d"); El canvas es una hoja en blanco, y ctx, hace referencia al elmeneto que podrá dibujar sobre esta hoja en blanco, entonces, ctx puede dibujar sobre canvasRef.current con el contexto 2d
 ctx.drawImage(videoRef.current, 0, 0, 640, 480); y ahi se llama a esta propiedad, para que dibuje adentro de su hoja en blanco asignada, el valor de videoRef con 0 0, x, y

 0 y 0 representan donde empezara a dibujarse la imagen con respecto al canvas del ctx


 
const detection = await faceapi
  .detectSingleFace(canvasRef.current, new faceapi.TinyFaceDetectorOptions())
  .withFaceLandmarks()
  .withFaceDescriptor();
 En resumen, obtiene una representación matemática del rostro actualmente visible en el video.
*/
