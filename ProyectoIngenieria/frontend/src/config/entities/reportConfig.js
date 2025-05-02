// Configuración de columnas según el tipo de reporte
export const getPreviewColumns = (reportType) => {
    switch (reportType) {
        case "sales":
            return [
                { field: "DSC_NOMBRE", label: "Cliente" },
                { field: "FEC_VENTA", label: "Fecha de venta" },
                { field: "METODO_PAGO", label: "Método de pago" },
                { field: "DSC_SALETYPE", label: "Tipo de venta" },
                { field: "MONT_SUBTOTAL", label: "Subtotal" },
                { field: "ESTADO", label: "Estado" },
            ];
        case "clients":
            return [
                { field: "DSC_CEDULA", label: "Cédula" },
                { field: "DSC_NOMBRE", label: "Nombre" },
                { field: "DSC_APELLIDOUNO", label: "Primer Apellido" },
                { field: "DSC_APELLIDODOS", label: "Segundo Apellido" },
                { field: "DSC_TELEFONO", label: "Teléfono" },
                { field: "ESTADO", label: "Estado" },
            ];
        case "suppliers":
            return [
                { field: "DSC_NOMBRE", label: "Nombre" },
                { field: "DSC_TELEFONO", label: "Teléfono" },
                { field: "DSC_TIPOPROVEEDOR", label: "Tipo de Proveedor" },
                { field: "DSC_CORREO", label: "Correo" },
                { field: "ESTADO", label: "Estado" },
            ];
        case "products":
            return [
                { field: "DSC_NOMBRE", label: "Nombre" },
                { field: "MON_VENTA", label: "Precio Venta" },
                { field: "MON_COMPRA", label: "Precio Compra" },
                { field: "CANTIDAD", label: "Cantidad" },
                { field: "ESTADO", label: "Estado" },
            ];
        default:
            return [];
    }
};

// Configuración de datos de ejemplo según el tipo de reporte
export const getPreviewData = (reportType) => {
    switch (reportType) {
        case "sales":
            return [
                {
                    "DSC_NOMBRE": "Cliente Ejemplo 1",
                    "FEC_VENTA": "2025-04-01",
                    "METODO_PAGO": "Pago en efectivo",
                    "DSC_SALETYPE": "Venta a contado",
                    "MONT_SUBTOTAL": 1500,
                    "ESTADO": "Pagada",
                    "subcategory": {
                        "DSC_NOMBRE": "Electrónica",
                        "ID_SUBCATEGORIA": 1
                    }
                },
                {
                    "DSC_NOMBRE": "Cliente Ejemplo 2",
                    "FEC_VENTA": "2025-04-02",
                    "METODO_PAGO": "Sinpe Movil",
                    "DSC_SALETYPE": "Venta a crédito",
                    "MONT_SUBTOTAL": 1200,
                    "ESTADO": "Pendiente",
                    "subcategory": {
                        "DSC_NOMBRE": "Ropa",
                        "ID_SUBCATEGORIA": 2
                    }
                }
            ];
        case "clients":
            return [
                {
                    "DSC_CEDULA": "1234567890",
                    "DSC_NOMBRE": "Juan Pérez",
                    "DSC_APELLIDOUNO": "Pérez",
                    "DSC_APELLIDODOS": "Gómez",
                    "DSC_TELEFONO": "600000000",
                    "ESTADO": "Activo",
                    "subcategory": {
                        "DSC_NOMBRE": "VIP",
                        "ID_SUBCATEGORIA": 1
                    }
                },
                {
                    "DSC_CEDULA": "0987654321",
                    "DSC_NOMBRE": "Ana Rodríguez",
                    "DSC_APELLIDOUNO": "Rodríguez",
                    "DSC_APELLIDODOS": "López",
                    "DSC_TELEFONO": "700000000",
                    "ESTADO": "Inactivo",
                    "subcategory": {
                        "DSC_NOMBRE": "Regular",
                        "ID_SUBCATEGORIA": 2
                    }
                }
            ];
        case "suppliers":
            return [
                {
                    "DSC_NOMBRE": "Proveedor Ejemplo 1",
                    "DSC_TELEFONO": "800000000",
                    "DSC_TIPOPROVEEDOR": "Proveedor de tecnología",
                    "DSC_CORREO": "proveedor1@ejemplo.com",
                    "ESTADO": "Activo",
                    "subcategory": {
                        "DSC_NOMBRE": "Internacional",
                        "ID_SUBCATEGORIA": 1
                    }
                },
                {
                    "DSC_NOMBRE": "Proveedor Ejemplo 2",
                    "DSC_TELEFONO": "810000000",
                    "DSC_TIPOPROVEEDOR": "Proveedor de ropa",
                    "DSC_CORREO": "proveedor2@ejemplo.com",
                    "ESTADO": "Activo",
                    "subcategory": {
                        "DSC_NOMBRE": "Local",
                        "ID_SUBCATEGORIA": 2
                    }
                }
            ];
        case "products":
            return [
                {
                    "DSC_NOMBRE": "Producto A",
                    "DSC_DESCRIPTION": "Descripción del producto A",
                    "DSC_CODIGO_BARRAS": "PROD2025001",
                    "URL_IMAGEN": "imagen_no_disponible.png",
                    "MON_VENTA": 1000,
                    "MON_COMPRA": 800,
                    "CANTIDAD": 50,
                    "ESTADO": "Activo",
                    "subcategory": {
                        "DSC_NOMBRE": "Categoría 1",
                        "ID_SUBCATEGORIA": 1
                    }
                },
                {
                    "DSC_NOMBRE": "Producto B",
                    "DSC_DESCRIPTION": "Descripción del producto B",
                    "DSC_CODIGO_BARRAS": "PROD2025002",
                    "URL_IMAGEN": "imagen_no_disponible.png",
                    "MON_VENTA": 1500,
                    "MON_COMPRA": 1200,
                    "CANTIDAD": 30,
                    "ESTADO": "Activo",
                    "subcategory": {
                        "DSC_NOMBRE": "Categoría 2",
                        "ID_SUBCATEGORIA": 2
                    }
                }
            ];
        default:
            return [];
    }
};
