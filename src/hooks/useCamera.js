import { useEffect, useRef } from "react";

export function useCamera() {
  const videoRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accediendo a la cámara:", err);
      }
    };
    startCamera();
  }, []);

  return videoRef;
}


// Se setea el luegar de origen del video como null
// Incia una función para acceder a la cámara (origen de video)
// Variable stream (datos provinientes de la camara), = a el dispositivo del usuario que tenga (video: true)
// La interfaz Navigator representa el estado del navegador y la identidad del user agent. 
// Video ref esta definido en el html, <video ref={videoRef} ></video>, al momento de montar el componente si el videoRef.current, es true (cargo el html), entonces se le asignca el stream de video a esa etiqueta video