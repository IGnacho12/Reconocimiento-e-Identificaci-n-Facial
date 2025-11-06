const KEY = "face_images";

export function read() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

export function write(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function destroy(id) {
  const all = read().filter((x) => x.id !== id);
  write(all);
}
/*
En este hook, esta la lógica para poder leer, escribir y borrar datos en el LocalStorage, en el ambito de face_images, es decir, las imagenes subidas por el usuario

Storage -> Provee acceso al almacenamiento de sesión o de almacenamiento local de un dominio en particular (es un objeto),


Si deseas manipular el almacenamiento de sesión para un dominio, debes llamar al método Window.sessionStorage
Si deseas manipular el almacenamiento local para un dominio, debes llamar a Window.localStorage.


Función read() -> retorna un JSON, de todas las imagenes guardadas en el ambito: face_images
Función write(data) -> Recibe data () y lo que hace es establecer adentro del face_images, un nuevo objeto, img.path 

*/