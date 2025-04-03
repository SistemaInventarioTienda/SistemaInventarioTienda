import React, { useState, useEffect } from "react";
import { Button, Input } from "../common";
import { Plus, Minus, Trash } from "lucide-react";
import "./styles/productTable.css";
import { getProductById } from '../../api/product';
const ActionButton = ({ onClick, color, children }) => (
    <Button
        className="btn me-3 p-0"
        style={{ backgroundColor: color, borderRadius: "16px", width: "40px", height: "40px" }}
        onClick={onClick}
    >
        {children}
    </Button>
);

const ActionsCell = ({ actions, rowData }) => (
    <div className="actions-cell">
        {actions.increment && (
            <ActionButton onClick={() => actions.increment(rowData)} color="#28A745">
                <Plus size={20} color="#FFFFFF" />
            </ActionButton>
        )}
        {actions.decrement && (
            <ActionButton onClick={() => actions.decrement(rowData)} color="#F9CB32">
                <Minus size={20} color="#FFFFFF" />
            </ActionButton>
        )}
        {actions.delete && (
            <ActionButton onClick={() => actions.delete(rowData)} color="#F44336">
                <Trash size={20} color="#FFFFFF" />
            </ActionButton>
        )}
    </div>
);

const ProductTable = ({ selectedProducts, updateProductQuantity, removeProduct, isViewMode = false }) => {
    const [productNames, setProductNames] = useState({});
    console.log(selectedProducts);
    useEffect(() => {
        const fetchProductNames = async () => {
            const names = { ...productNames };
            let needsUpdate = false;

            for (const product of selectedProducts) {
                if (product.name || names[product.id]) continue;

                try {
                    const data = await getProductById(product.id);
                    names[product.id] = data.DSC_NOMBRE;
                    needsUpdate = true;
                } catch (error) {
                    console.error("Error obteniendo nombre del producto:", error);
                    names[product.id] = "Producto no encontrado";
                    needsUpdate = true;
                }
            }

            if (needsUpdate) {
                setProductNames(names);
            }
        };

        if (isViewMode) {
            fetchProductNames();
        }
    }, [selectedProducts, isViewMode]);

    // Función para obtener el nombre a mostrar
    const getDisplayName = (product) => {
        if (product.name) return product.name;
        if (productNames[product.id]) return productNames[product.id];
        return isViewMode ? "Cargando..." : "Sin nombre";
    };

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity < 1) return;
        updateProductQuantity(id, newQuantity);
    };

    return (
        <div className="table-container">
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        {!isViewMode && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {selectedProducts.length > 0 ? (
                        selectedProducts.map((product) => {
                            const price = product.price || 0;
                            const quantity = product.quantity || 0;
                            const subtotal = product.subtotal ?? price * quantity;

                            return (
                                <tr key={product.id}>
                                    <td>{getDisplayName(product)}</td>
                                    <td>₡{price.toLocaleString()}</td>
                                    <td>
                                        {isViewMode ? (
                                            quantity
                                        ) : (
                                            <Input
                                                type="number"
                                                min="1"
                                                value={quantity}
                                                onChange={(e) =>
                                                    handleQuantityChange(product.id, parseInt(e.target.value, 10) || 1)
                                                }
                                                style={{ textAlign: "center" }}
                                            />
                                        )}
                                    </td>
                                    <td>₡{subtotal.toLocaleString()}</td>
                                    {!isViewMode && (
                                        <td>
                                            <ActionsCell
                                                rowData={product}
                                                actions={{
                                                    increment: (row) => handleQuantityChange(row.id, row.quantity + 1),
                                                    decrement: (row) => handleQuantityChange(row.id, row.quantity - 1),
                                                    delete: (row) => removeProduct(row.id),
                                                }}
                                            />
                                        </td>
                                    )}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={isViewMode ? 4 : 5} className="no-data-message">
                                No hay productos {isViewMode ? "en esta venta" : "seleccionados"}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;
