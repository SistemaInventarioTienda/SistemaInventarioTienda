// worker.js
onmessage = async function (event) {
    // console.log('Received message from the main thread:', event.data);

    try {
        const response = await fetch(`https://api.hacienda.go.cr/fe/ae?identificacion=${event.data}`);
        if (response.ok) {
            const data = await response.json();
            if (data.nombre) {
                const nombreCompleto = data.nombre.split(" ");
                const nombre = capitalizar(nombreCompleto[0]);
                if (nombreCompleto.length === 4) {
                    const segundoNombre = capitalizar(nombreCompleto[1]);
                    const apellidoUno = capitalizar(nombreCompleto[2]);
                    const apellidoDos = capitalizar(nombreCompleto[3]);

                    const result = {
                        nombre: nombre,
                        segundoNombre: segundoNombre,
                        apellidoUno: apellidoUno,
                        apellidoDos: apellidoDos,
                      };
                      
                      postMessage(result);                      
                    //Enviar datos
                } else {
                    const segundoNombre = "";
                    const apellidoUno = capitalizar(nombreCompleto[1]);
                    const apellidoDos = capitalizar(nombreCompleto[2]);
                    // Enviar datos
                    const result = {
                        nombre: nombre,
                        segundoNombre: segundoNombre,
                        apellidoUno: apellidoUno,
                        apellidoDos: apellidoDos,
                      };
                      
                    postMessage(result);  
                }
            } 
        }
    } catch (error) {
        // console.error("Error en la solicitud:", error);
        // postMessage(error);
    }
};

function capitalizar(cadena) {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1).toLowerCase();
}