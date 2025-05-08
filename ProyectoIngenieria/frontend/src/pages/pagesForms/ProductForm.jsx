import React, { useEffect, useState } from 'react';
import GenericForm from '../../components/common/GenericForm';
import { productConfig } from "../../config/entities/productConfig";

function ProductForm({ mode, initialData, onSubmit, onCancel }) {

    const [categories, setCategories] = useState([]);
    const [subcategoriesTypes, setSubcategoriesTypes] = useState([]);
    const [formData, setFormData] = useState(null);

    // Cargar categorías y subcategorías al montar el componente
    useEffect(() => {
        async function fetchCategories() {
            try {
                const categories = await productConfig.api.fetchAllCategories();
                const extractedCategories = categories.categories.map((item) => ({
                    ID_CATEGORIA: item.ID_CATEGORIA,
                    DSC_NOMBRE: item.DSC_NOMBRE
                }));
                setCategories(extractedCategories);
            } catch (error) {
                console.error("Error al obtener las categorías:", error);
            }
        }

        async function fetchSubcategoriesTypes() {
            try {
                const types = await productConfig.api.fetchAllSubcategoriesTypes();
                const extractedSubcategories = types.subcategory.map((item) => ({
                    ID_SUBCATEGORIA: item.ID_SUBCATEGORIA,
                    DSC_NOMBRE: item.DSC_NOMBRE,
                    ID_CATEGORIA: item.ID_CATEGORIA
                }));
                setSubcategoriesTypes(extractedSubcategories);

                if (initialData) {
                    const matchedType = extractedSubcategories.find(
                        (subcategory) => subcategory.ID_SUBCATEGORIA === initialData.ID_SUBCATEGORIA
                    );
                    setFormData({
                        ...initialData,
                        SUBCATEGORIA: matchedType ? matchedType.ID_SUBCATEGORIA : "",
                    });
                } else {
                    setFormData({});
                }
            } catch (error) {
                console.error("Error al obtener los tipos de subcategorías:", error);
            }
        }

        fetchCategories();
        fetchSubcategoriesTypes();
    }, [initialData]);

    // Si los datos del formulario aún no están listos
    if (!formData) {
        return <p>Cargando...</p>;
    }

    // Filtrar subcategorías según la categoría seleccionada
    const filteredSubcategories = formData.ID_CATEGORIA
        ? subcategoriesTypes.filter(
            (sub) => sub.ID_CATEGORIA === formData.ID_CATEGORIA
        )
        : [];

    // Manejar el cambio de los campos del formulario
    const handleChange = (field, value) => {
        const updatedFormData = { ...formData, [field]: value };

        // Si cambia la categoría, limpia la subcategoría seleccionada
        if (field === 'ID_CATEGORIA') {
            updatedFormData.SUBCATEGORIA = '';
        }

        setFormData(updatedFormData);
    };

    return (
        <GenericForm
            entityName={"Producto"}
            mode={mode}
            initialData={formData}
            fields={productConfig.fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
            categories={categories}
            subcategoriesTypes={filteredSubcategories} // Pasar solo las subcategorías filtradas
            onFieldChange={handleChange} // Pasar el manejador de cambios
        />
    );
}

export default ProductForm;
