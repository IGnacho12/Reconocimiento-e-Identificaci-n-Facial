import React from "react";

export default function Test() {
  return (
    <>
      <main>
        {/* Sección para almacenar todos las imagenes (nombre, img, dni, deleteButton) */}
        <section>{/* Mapeo del component, registerFace */}</section>

        {/* Sección para mostrar el registerFace Activod y camara */}
        <section>
          <header>{/* RegisterFace activo */}</header>
          <main>{/* Canvas de la imagen de la cámara */}</main>
        </section>
      </main>
    </>
  );
}
