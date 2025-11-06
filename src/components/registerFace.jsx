import React from "react";

export default function RegisterFaceCard({
  nombre = "Nombre del alumno",
  dni = "482374782",
  cursoYDivision = "6IV",
  materias,
  className = "",
}) {
  return (
    <button
      className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:cursor-pointer hover:scale-105 hover:border-bg-light transition-all shadow-sm border-2 border-gray-600/40  ${className}`}
    >
      {/* Avatar del estudiante */}
      <img
        src="https://images.unsplash.com/photo-1519594774370-0b631f3d527e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcmElMjBkZSUyMHBlcnJvfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000"
        alt={nombre}
        className="h-12 w-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
      />

      {/* Información del alumno */}
      <article className="flex flex-col justify-between w-full">
        <div className="flex flex-col w-full">
          <article className="flex-row flex justify-between items-center w-full">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {nombre}
            </h1>
            {materias && (
              <span className="text-xs text-gray-700 dark:text-gray-300">
                [ {materias} ]
              </span>
            )}
          </article>

          <article className="flex-row flex justify-between items-center w-full mt-1">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              DNI: {dni}
            </span>
            {cursoYDivision && (
              <span className="text-xs text-gray-700 dark:text-gray-300">
                {cursoYDivision}
              </span>
            )}
          </article>
        </div>
      </article>
    </button>
  );
}
