import React, { useEffect, useState } from 'react';
import GenericForm from '../../components/common/GenericForm';
import { supplierConfig } from "../../config/entities/supplierConfig";

function SupplierForm({ mode, initialData, onSubmit, onCancel }) {
    const [supplierTypes, setSupplierTypes] = useState([]);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        async function fetchSupplierTypes() {
            try {
                const types = await supplierConfig.api.fetchAllSuppliersTypes();
                setSupplierTypes(types.type || []);
                if (initialData) {
                    const matchedType = types.type.find(
                        (type) => type.DSC_NOMBRE === initialData.tipoProveedor
                    );
                    setFormData({
                        ...initialData,
                        tipoProveedor: matchedType ? matchedType.ID_TIPOPROVEEDOR : "",
                    });
                }
            } catch (error) {
                console.error("Error al obtener los tipos de proveedores:", error);
            }
        }
        fetchSupplierTypes();
    }, [initialData]);

    if (!formData) {
        return <p>Cargando...</p>;
    }

    return (
        <GenericForm
            entityName={"Proveedor"}
            mode={mode}
            initialData={formData}
            fields={supplierConfig.fields}
            onSubmit={onSubmit}
            onCancel={onCancel}
            supplierTypes={supplierTypes}
        />
    );
}

export default SupplierForm;
