import React, { useState, useRef } from "react";
import { EntityPage } from "./EntityPage";
import { categoryConfig } from "../config/entities/categoryConfig";
import { subcategoryConfig } from "../config/entities/subcategoryConfig";
import CategoryForm from "./pagesForms/CategoryForm";
import SubcategoryForm from "./pagesForms/SubcategoryForm";
import handleApiCall from "../utils/handleApiCall";
import { ModalComponent, ModalConfirmation } from "../components/modals";

export default function CategoryPage() {
    const entityPageRef = useRef(); // Crear una referencia a EntityPage
    const {
        entityName,
        entityMessage,
        columns,
        fields,
        entityKey,
        api,
        transformData,
        transformConfig,
        actions,
        expandableKey,
    } = categoryConfig;

    // Estados para manejar subcategorías
    const [isSubcategoryModalOpen, setSubcategoryModalOpen] = useState(false);
    const [subcategoryModalMode, setSubcategoryModalMode] = useState("add");
    const [subcategoryModalData, setSubcategoryModalData] = useState(null);
    const [parentCategoryId, setParentCategoryId] = useState(null);
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Lógica para categorías
    const onSubmit = async (mode, data) => {
        try {
            const backendData = transformData.toBackend(data);
            if (mode === "add") {
                await handleApiCall(
                    () => api.create(backendData),
                    "Categoría agregada exitosamente."
                );
            } else if (mode === "edit") {
                await handleApiCall(
                    () => api.update(backendData),
                    "Categoría actualizada exitosamente."
                );
            }
            entityPageRef.current.fetchData(); // Actualizar datos después de la operación
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    };

    // Lógica para subcategorías
    const onSubmitSubcategory = async (mode, data) => {
        try {
            const backendData = subcategoryConfig.transformData.toBackend({
                ...data,
                ID_CATEGORIA: parentCategoryId
            });

            if (mode === "add") {
                await handleApiCall(
                    () => subcategoryConfig.api.createSub(backendData),
                    "Subcategoría agregada exitosamente."
                );
            } else if (mode === "edit") {
                await handleApiCall(
                    () => subcategoryConfig.api.updateSub(backendData),
                    "Subcategoría actualizada exitosamente."
                );
            }
            entityPageRef.current.fetchData(); // Actualizar datos después de la operación
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    };

    // Lógica para eliminar subcategorías
    const handleConfirmDelete = async () => {
        try {
            console.log("A eliminar: " + itemToDelete.ID_SUBCATEGORIA);
            await handleApiCall(
                () => subcategoryConfig.api.deleteSub(itemToDelete.ID_SUBCATEGORIA),
                "Subcategoría eliminada exitosamente."
            );
            entityPageRef.current.fetchData(); // Actualizar datos después de la operación
            setConfirmationModalOpen(false);
            return { success: true };
        } catch (error) {
            return { success: false };
        }
    };

    // Handlers para subcategorías
    const handleAddSubcategory = (categoryId) => {
        setParentCategoryId(categoryId);
        setSubcategoryModalMode("add");
        setSubcategoryModalData(subcategoryConfig.transformData.toBackend({ ID_CATEGORIA: categoryId }));
        setSubcategoryModalOpen(true);
    };

    const handleEditSubcategory = (subcategory) => {
        console.log("Edit Subcategory: " + JSON.stringify(subcategoryConfig.transformData.toFrontend(subcategory), null, 2));
        setSubcategoryModalMode("edit");
        setSubcategoryModalData(subcategoryConfig.transformData.toFrontend(subcategory));
        setParentCategoryId(subcategory.ID_CATEGORIA);
        setSubcategoryModalOpen(true);
    };

    const handleDeleteSubcategory = (subcategory) => {
        setItemToDelete(subcategory);
        setConfirmationModalOpen(true);
    };

    return (
        <>
            <EntityPage
                ref={entityPageRef} // Pasar la referencia a EntityPage
                entityName={entityName}
                entityMessage={entityMessage}
                columns={columns}
                fields={fields}
                fetchAll={api.fetchAll}
                searchByName={api.searchByName}
                onSubmit={onSubmit}
                onDelete={(category) => api.delete(category.DSC_NOMBRE)}
                modalComponent={CategoryForm}
                entityKey={entityKey}
                transformData={transformData.toFrontend}
                transformConfig={transformConfig}
                actions={actions}
                expandableKey={expandableKey}
                onAddSubcategory={handleAddSubcategory}
                subcategoryActions={{
                    edit: handleEditSubcategory,
                    delete: handleDeleteSubcategory
                }}
            />

            {/* Modal para subcategorías */}
            <ModalComponent
                isOpen={isSubcategoryModalOpen}
                title={subcategoryModalMode === "add" ? "Agregar Subcategoría" : "Editar Subcategoría"}
                mode={subcategoryModalMode}
                onClose={() => setSubcategoryModalOpen(false)}
                entityName="Subcategoría"
            >
                <SubcategoryForm
                    mode={subcategoryModalMode}
                    initialData={subcategoryModalData}
                    fields={subcategoryConfig.fields}
                    onSubmit={async (formData) => {
                        const response = await onSubmitSubcategory(subcategoryModalMode, formData);
                        if (response.success) {
                            setSubcategoryModalOpen(false);
                        }
                    }}
                    onCancel={() => setSubcategoryModalOpen(false)}
                />
            </ModalComponent>

            {/* Modal de confirmación para eliminar */}
            <ModalConfirmation
                isOpen={confirmationModalOpen}
                onClose={() => setConfirmationModalOpen(false)}
                onConfirm={handleConfirmDelete}
                entityName="Subcategoría"
                action="delete"
                confirmButtonText="Eliminar"
                cancelButtonText="Cancelar"
            />
        </>
    );
}