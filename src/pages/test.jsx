import React from "react";
import RegisterFaceCard from "../components/registerFace";
import BotonGuardar from "../components/botonGuardar";

export default function Test() {
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
        {[...Array(12)].map((_, i) => (
          <RegisterFaceCard key={i} />
        ))}
      </aside>

      {/* 🎥 Sección principal: cámara + alumno activo */}
      <section className="flex flex-col items-center justify-start overflow-y-auto">
        <header className="w-full text-center">
          <h2 className="text-2xl font-bold">Alumno detectado</h2>

          <div className="flex justify-center">
            <RegisterFaceCard className="max-w-md w-full" />
          </div>
        </header>

        {/* Canvas de la cámara */}
        <div className="relative flex justify-center items-center w-full max-w-4xl py-2">
          <canvas className="aspect-video w-full max-w-3xl border border-gray-400/40 rounded-lg shadow-inner bg-gray-50 dark:bg-gray-800"></canvas>

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
