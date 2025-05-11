import React, { useEffect, useState } from 'react';
import GenericForm from '../../components/common/GenericForm';
import { productConfig } from "../../config/entities/productConfig";

function ProductForm({ mode, initialData, onSubmit, onCancel }) {
    const [categories, setCategories] = useState([]);
    const [subcategoriesTypes, setSubcategoriesTypes] = useState([]);
    const [formData, setFormData] = useState({}); // Inicializar como objeto vacío

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
                        CATEGORIA: matchedType ? matchedType.ID_CATEGORIA : "",
                    });
                }
            } catch (error) {
                console.error("Error al obtener los tipos de subcategorías:", error);
            }
        }

        fetchCategories();
        fetchSubcategoriesTypes();
    }, [initialData]);

    // Filtrar subcategorías según la categoría seleccionada
    const filteredSubcategories = formData?.CATEGORIA
        ? subcategoriesTypes.filter(
            (sub) => sub.ID_CATEGORIA === formData.CATEGORIA
        )
        : [];

    // Manejar el cambio de los campos del formulario
    const handleChange = (field, value) => {
        const updatedFormData = { ...formData, [field]: value };

        // Si cambia la categoría, limpia la subcategoría seleccionada
        if (field === 'CATEGORIA') {
            updatedFormData.SUBCATEGORIA = '';
        }

        setFormData(updatedFormData);
    };

    useEffect(() => {
        if (formData?.CATEGORIA) {
            const filtered = subcategoriesTypes.filter(
                (sub) => sub.ID_CATEGORIA === formData.CATEGORIA
            );
            console.log("Subcategorías filtradas:", filtered);
        }
    }, [formData?.CATEGORIA, subcategoriesTypes]);
    

    return (
        <GenericForm
            entityName={"Producto"}
            mode={mode}
            initialData={formData}
            fields={productConfig.fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
            categories={categories}
            subcategoriesTypes={filteredSubcategories}
            onFieldChange={handleChange}
        />
    );
}

export default ProductForm;