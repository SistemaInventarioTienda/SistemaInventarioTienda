// workers/searchPerson.worker.js

onmessage = async function (event) {
  try {
    const response = await fetch(
      `https://api.hacienda.go.cr/fe/ae?identificacion=${event.data}`,
    );
    if (!response.ok) {
      throw new Error("API response not OK");
    }

    const data = await response.json();
    if (!data.nombre) {
      throw new Error("No data found for the given ID");
    }

    const parts = data.nombre.trim().split(/\s+/).map(capitalizar);

    const apellidoDos = parts.length > 0 ? parts.pop() : "";
    const apellidoUno = parts.length > 0 ? parts.pop() : "";

    let nombre = "";
    let segundoNombre = "";

    if (parts.length > 0) {
      nombre = parts[0];
      if (parts.length > 1) {
        segundoNombre = parts.slice(1).join(" ");
      }
    }

    postMessage({
      nombre,
      segundoNombre,
      apellidoUno,
      apellidoDos,
    });
  } catch (error) {
    console.error("Error en la solicitud:", error);
    postMessage(null); // Indicar que hubo un error
  }
};

function capitalizar(cadena) {
  return cadena.charAt(0).toUpperCase() + cadena.slice(1).toLowerCase();
}
