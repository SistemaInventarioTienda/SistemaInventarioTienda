import React, { useEffect, useState } from "react";
import GenericForm from "../../components/common/GenericForm";
import { salesConfig } from "../../config/entities/salesConfig";
import ProductTable from "../../components/features/ProductTable";

function SaleForm({ initialData, onSubmit, onCancel }) {
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        if (initialData?.PRODUCTS_LIST) {
            setSelectedProducts(initialData.PRODUCTS_LIST);
        }
    }, [initialData]);

    return (
        <div>
            <label style={{ marginBottom: "10px", marginTop: "10px" }}>Productos incluidos en la venta</label>
            <ProductTable selectedProducts={selectedProducts} isViewMode={true} />
            <GenericForm
                entityName={"Venta"}
                mode={"view"}
                initialData={initialData}
                fields={salesConfig.fields}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        </div>
    );
}

export default SaleForm;
