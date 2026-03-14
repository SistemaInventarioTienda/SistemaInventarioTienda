// Configuración de la entidad "Productos"
import {
  getAllProducts,
  searchProduct,
  registerProduct,
  updateProduct,
  deleteProduct,
} from "../../api/product";

import { getAllSubcategoriesTypes } from "../../api/subcategory";

import { getAllCategoriesWithoutPag } from "../../api/category";
import { formatPrice } from "../../utils/formatters";

// Configuración principal de la entidad
export const productConfig = {
  // Nombre y descripción de la entidad
  entityName: "Producto",
  titlePage: "Productos",
  entityMessage: "Gestión de productos del sistema",

  // Identificador clave de la entidad
  entityKey: "products",

  // Configuración de columnas para la tabla
  columns: [
    { field: "DSC_NOMBRE", label: "Nombre" },
    { field: "MON_VENTA", label: "Precio Venta", formatter: formatPrice },
    { field: "MON_COMPRA", label: "Precio Compra", formatter: formatPrice },
    { field: "CANTIDAD", label: "Cantidad" },
    { field: "ESTADO", label: "Estado" },
    { field: "actions", label: "Acciones" },
  ],

  // Configuración de campos del formulario
  fields: [
    {
      name: "DSC_CODIGO_BARRAS",
      label: "Código de Barras",
      type: "text",
      required: true,
    },
    {
      name: "DSC_CODIGO_PROD",
      label: "Código del Producto",
      type: "text",
      required: true,
    },
    {
      name: "DSC_NOMBRE",
      label: "Nombre del Producto",
      type: "text",
      required: true,
    },
    {
      name: "DSC_DESCRIPTION",
      label: "Descripción",
      type: "textarea",
      required: true,
    },
    {
      name: "CATEGORIA",
      label: "Categoría del Producto",
      type: "select",
      required: true,
    },
    {
      name: "SUBCATEGORIA",
      label: "Subcategoría del Producto",
      type: "select",
      required: true,
    },
    {
      name: "foto",
      type: "file",
      required: false,
      resourcePath: "images/products",
    },
    {
      name: "MON_VENTA",
      label: "Precio de Venta",
      type: "number",
      required: true,
    },
    {
      name: "MON_COMPRA",
      label: "Precio de Compra",
      type: "number",
      required: true,
    },
    { name: "CANTIDAD", label: "Cantidad", type: "number", required: false },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      required: true,
      options: [
        { value: 1, label: "Activo" },
        { value: 0, label: "Inactivo" },
      ],
    },
  ],

  // Funciones API específicas de la entidad
  api: {
    fetchAllCategories: getAllCategoriesWithoutPag,
    fetchAllSubcategoriesTypes: getAllSubcategoriesTypes,
    fetchAll: getAllProducts,
    searchByName: searchProduct,
    create: registerProduct,
    update: updateProduct,
    delete: deleteProduct,
  },

  // Transformaciones de datos
  transformData: {
    toFrontend: (product) => ({
      id: product.ID_PRODUCT,
      DSC_NOMBRE: product.DSC_NOMBRE,
      DSC_DESCRIPTION: product.DSC_DESCRIPTION,
      DSC_CODIGO_BARRAS: product.DSC_CODIGO_BARRAS,
      foto: product.URL_IMAGEN,
      MON_VENTA: product.MON_VENTA,
      MON_COMPRA: product.MON_COMPRA,
      CANTIDAD: product.CANTIDAD,
      estado: product.ESTADO === "ACTIVO" ? 1 : 2,
      ID_SUBCATEGORIA: product.subcategory?.ID_SUBCATEGORIA || "",
      DSC_CODIGO_PROD: product.DSC_CODIGO_PROD || "",
    }),

    toBackend: async (formData) => {
      const data = new FormData();
      data.append("ID_PRODUCT", formData.id);
      data.append("DSC_NOMBRE", formData.DSC_NOMBRE);
      data.append("DSC_DESCRIPTION", formData.DSC_DESCRIPTION);
      data.append("DSC_CODIGO_BARRAS", formData.DSC_CODIGO_BARRAS);
      data.append("MON_VENTA", parseFloat(formData.MON_VENTA));
      data.append("MON_COMPRA", parseFloat(formData.MON_COMPRA));
      data.append("ESTADO", formData.estado);
      data.append("SUBCATEGORIA", formData.SUBCATEGORIA);
      data.append("DSC_CODIGO_PROD", formData.DSC_CODIGO_PROD);
      data.append("CANTIDAD", formData.CANTIDAD);

      if (formData.foto instanceof File) {
        data.append("PRODUCT_IMAGE", formData.foto);
      }

      return data;
    },
  },

  // Transformaciones específicas de campos
  transformConfig: {
    ESTADO: (item) => (item.ESTADO === 1 ? "ACTIVO" : "INACTIVO"),
    URL_IMAGEN: (item) => item.URL_IMAGEN || "/default-product.png",
  },

  // Configuración de acciones
  actions: {
    edit: true,
    delete: true,
    view: true,
  },
};
