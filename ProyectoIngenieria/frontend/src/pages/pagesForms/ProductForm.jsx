import React, { useEffect, useState } from 'react';
import GenericForm from '../../components/common/GenericForm';
import { productConfig } from "../../config/entities/productConfig";

function ProductForm({ mode, initialData, onSubmit, onCancel }) {

    const [subcategoriesTypes, setSubcategoriesTypes] = useState([]);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        async function fetchSubcategoriesTypes() {
            try {
                const types = await productConfig.api.fetchAllSubcategoriesTypes();

                const extractedSubcategories = types.subcategory.map((item) => ({
                    ID_SUBCATEGORIA: item.ID_SUBCATEGORIA,
                    DSC_NOMBRE: item.DSC_NOMBRE
                }));

                setSubcategoriesTypes(extractedSubcategories);

                if (initialData) {
                    const matchedType = extractedSubcategories.find(
                        (subcategory) => subcategory.ID_SUBCATEGORIA === initialData.ID_SUBCATEGORIA
                    );
                    setFormData({
                        ...initialData,
                        SUBCATEGORIA: matchedType ? matchedType.SUBCATEGORIA : "",
                    });
                } else {
                    setFormData({});
                }
            } catch (error) {
                console.error("Error al obtener los tipos de subcategorías:", error);
            }
        }
        fetchSubcategoriesTypes();
    }, [initialData]);

    if (!formData) {
        return <p>Cargando...</p>;
    }

    return (
        <GenericForm
            entityName={"Producto"}
            mode={mode}
            initialData={formData}
            fields={productConfig.fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
            subcategoriesTypes={subcategoriesTypes}
        />
    );
}

export default ProductForm;
