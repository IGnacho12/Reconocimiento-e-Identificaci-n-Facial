import React from "react";

export default function RegisterFaceCard({
  nombre = "Nombre del alumno",
  dni = "482374782",
  cursoYDivision = "6IV",
  materias,
  className = "",
  selected = false,
  path = "https://img.icons8.com/m_rounded/1200/user-not-found.jpg"
}) {
  return (
    <button
      className={` flex items-center w-full gap-3 px-4 py-3 rounded-lg hover:cursor-pointer hover:scale-105  transition-all shadow-sm border-2  ${className} ${selected ? "border-emerald-400" : ""}`}
    >
      {/* Avatar del estudiante */}
      <img
        src={path}
        alt={nombre}
        className="h-12 w-12 rounded-full object-cover "
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
