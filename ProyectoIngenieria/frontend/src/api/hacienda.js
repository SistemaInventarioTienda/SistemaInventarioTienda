export const getPersonById = async (id) => {
    try {
        const response = await fetch(`https://api.hacienda.go.cr/fe/ae?identificacion=${id}`);
        if (response.ok) {
            const data = await response.json();
            if (data.nombre) {
                const nombreCompleto = data.nombre.split(" ");
                const nombre = capitalizar(nombreCompleto[0]);
                if (nombreCompleto.length === 4) {
                    const segundoNombre = capitalizar(nombreCompleto[1]);
                    const apellidoUno = capitalizar(nombreCompleto[2]);
                    const apellidoDos = capitalizar(nombreCompleto[3]);
                    return {nombre, segundoNombre, apellidoUno, apellidoDos};
                    //Enviar datos
                } else {
                    const segundoNombre = "";
                    const apellidoUno = capitalizar(nombreCompleto[1]);
                    const apellidoDos = capitalizar(nombreCompleto[2]);
                    // Enviar datos
                    return {nombre, segundoNombre, apellidoUno, apellidoDos};
                }
                

            } 
        }
    } catch (error) {
        // console.error("Error en la solicitud:", error);
    }
};

function capitalizar(cadena) {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1).toLowerCase();
}