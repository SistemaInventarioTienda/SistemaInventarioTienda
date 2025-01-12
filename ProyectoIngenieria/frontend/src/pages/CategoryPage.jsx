import React from "react";
import { EntityPage } from "./EntityPage";
import { getAllCategories, saveCategory, updateCategory, deleteCategory, searchCategoryByName, } from "../api/category";
import CategoryForm from "./forms/CategoryForm";
import { categoryFormFields } from '../pages/forms/fields/CategoryFormFields';

export default function CategoryPage() {


    const mapCategoryFields = (category) => ({
        id: category.ID_CATEGORIA,
        nombre: category.DSC_NOMBRE,
        estado: category.ESTADO === "ACTIVO" ? 1 : 2,
    });

    const mapToBackendFields = (formData) => ({
        ID_CATEGORIA: formData.id,
        DSC_NOMBRE: formData.nombre,
        ESTADO: formData.estado,
    });

    const handleCategorySubmit = async (mode, categoryData) => {
        const backendData = mapToBackendFields(categoryData);
        if (mode === "add") {
            await saveCategory(backendData);
        } else if (mode === "edit") {
            console.log("Edit category", categoryData);
            await updateCategory(backendData);
        }
    };

    return (
        <EntityPage
            entityName="Categoria"
            entityMessage="Gestión de Categorías del sistema"
            columns={[
                { field: "DSC_NOMBRE", label: "Nombre" },
                { field: "ESTADO", label: "Estado" },
                { field: "actions", label: "Acciones" },
            ]}
            fields={categoryFormFields}
            fetchAll={getAllCategories}
            searchByName={searchCategoryByName}
            onSubmit={handleCategorySubmit}
            onDelete={(category) => deleteCategory(category.DSC_NOMBRE)}
            modalComponent={CategoryForm}
            entityKey="category"
            transformData={mapCategoryFields}
        />
    );
}    