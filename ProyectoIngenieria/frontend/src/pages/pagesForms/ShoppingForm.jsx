import React, { useEffect, useState } from "react";
import GenericForm from "../../components/common/GenericForm";
import { shoppingConfig } from "../../config/entities/shoppingConfig";
import ProductTable from "../../components/features/ProductTable";

function ShoppingForm({ initialData, onSubmit, onCancel }) {
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
 
        if (initialData?.PRODUCTS_LIST) {
            setSelectedProducts(initialData.PRODUCTS_LIST);
        }
    }, [initialData]);

    return (
        <div>
            <label style={{ marginBottom: "10px", marginTop: "10px" }}>Productos incluidos en la compra</label>
            <ProductTable selectedProducts={selectedProducts} isViewMode={true} />
            <GenericForm
                entityName={"Compra"}
                mode={"view"}
                initialData={initialData}
                fields={shoppingConfig.fields}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        </div>
    );
}

export default ShoppingForm;
