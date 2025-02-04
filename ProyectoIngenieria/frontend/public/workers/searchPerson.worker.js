// workers/searchPerson.worker.js

onmessage = async function (event) {
    try {
        const response = await fetch(`https://api.hacienda.go.cr/fe/ae?identificacion=${event.data}`);
        if (!response.ok) {
            throw new Error("API response not OK");
        }

        const data = await response.json();
        if (!data.nombre) {
            throw new Error("No data found for the given ID");
        }

        const nombreCompleto = data.nombre.split(" ");
        const nombre = capitalizar(nombreCompleto[0]);

        let segundoNombre = "";
        let apellidoUno = "";
        let apellidoDos = "";

        if (nombreCompleto.length === 4) {
            segundoNombre = capitalizar(nombreCompleto[1]);
            apellidoUno = capitalizar(nombreCompleto[2]);
            apellidoDos = capitalizar(nombreCompleto[3]);
        } else {
            apellidoUno = capitalizar(nombreCompleto[1]);
            apellidoDos = capitalizar(nombreCompleto[2]);
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