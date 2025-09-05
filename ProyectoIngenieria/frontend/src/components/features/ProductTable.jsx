import React, { useState, useEffect } from "react";
import { Button, Input } from "../common";
import { Plus, Minus, Trash } from "lucide-react";
import "./styles/productTable.css";
import { getProductById } from "../../api/product";
import { toast } from "sonner";

const ActionButton = ({ onClick, color, children }) => (
    <Button
        className="btn me-3 p-0"
        style={{
            backgroundColor: color,
            borderRadius: "16px",
            width: "40px",
            height: "40px",
        }}
        onClick={onClick}
    >
        {children}
    </Button>
);

const ActionsCell = ({ actions, rowData }) => (
    <div className="actions-cell">
        {actions.increment && (
            <ActionButton
                onClick={() => actions.increment(rowData)}
                color="#28A745"
            >
                <Plus size={20} color="#FFFFFF" />
            </ActionButton>
        )}
        {actions.decrement && (
            <ActionButton
                onClick={() => actions.decrement(rowData)}
                color="#F9CB32"
            >
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

const ProductTable = ({
    selectedProducts,
    updateProductQuantity,
    removeProduct,
    updateProductField, // nueva función para actualizar descuento/impuesto
    isViewMode = false,
    enablePerItemAdjustments = false, // FLAG para habilitar descuentos/impuestos por producto
}) => {
    const [productNames, setProductNames] = useState({});

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

    // Obtener nombre del producto
    const getDisplayName = (product) => {
        if (product.name) return product.name;
        if (productNames[product.id]) return productNames[product.id];
        return isViewMode ? "Cargando..." : "Sin nombre";
    };

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity < 1) return;
        updateProductQuantity(id, newQuantity);
    };

    const handleFieldChange = (id, field, value) => {
        if (value < 0 || value > 100) {
            toast.error(
                `${field === "discount" ? "El descuento" : "El impuesto"} debe estar entre 0% y 100%`
            );
            return;
        }

        if (updateProductField) {
            updateProductField(id, field, value);
        }
    };

    return (
        <div className="table-container">
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        {/* Mostrar siempre descuento e impuesto en modo vista */}
                        {(enablePerItemAdjustments || isViewMode) && <th>Descuento (%)</th>}
                        {(enablePerItemAdjustments || isViewMode) && <th>Impuesto (%)</th>}
                        <th>Subtotal</th>
                        {!isViewMode && <th>Acciones</th>}
                    </tr>
                </thead>
                <tbody>
                    {selectedProducts.length > 0 ? (
                        selectedProducts.map((product) => {
                            const price = product.price || 0;
                            const quantity = product.quantity || 0;
                            const discount = product.discount || 0;
                            const tax = product.tax || 0;

                            const base = price * quantity;
                            const discountAmount = (base * discount) / 100;
                            const afterDiscount = base - discountAmount;
                            const taxAmount = (afterDiscount * tax) / 100;
                            const subtotal = afterDiscount + taxAmount;

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
                                                    handleQuantityChange(
                                                        product.id,
                                                        parseInt(e.target.value, 10) || 1
                                                    )
                                                }
                                                style={{ textAlign: "center" }}
                                            />
                                        )}
                                    </td>

                                    {(enablePerItemAdjustments || isViewMode) && (
                                        <td>{isViewMode ? `${discount}%` : (
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={discount}
                                                onChange={(e) =>
                                                    handleFieldChange(product.id, "discount", Number(e.target.value))
                                                }
                                                style={{ textAlign: "center" }}
                                            />
                                        )}</td>
                                    )}

                                    {(enablePerItemAdjustments || isViewMode) && (
                                        <td>{isViewMode ? `${tax}%` : (
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={tax}
                                                onChange={(e) =>
                                                    handleFieldChange(product.id, "tax", Number(e.target.value))
                                                }
                                                style={{ textAlign: "center" }}
                                            />
                                        )}</td>
                                    )}

                                    <td>₡{subtotal.toLocaleString()}</td>

                                    {!isViewMode && (
                                        <td>
                                            <ActionsCell
                                                rowData={product}
                                                actions={{
                                                    increment: (row) =>
                                                        handleQuantityChange(row.id, row.quantity + 1),
                                                    decrement: (row) =>
                                                        handleQuantityChange(row.id, row.quantity - 1),
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
                            <td
                                colSpan={
                                    isViewMode
                                        ? (enablePerItemAdjustments ? 6 : 6)
                                        : enablePerItemAdjustments
                                            ? 7
                                            : 5
                                }
                                className="no-data-message"
                            >
                                No hay productos {isViewMode ? "en esta lista" : "seleccionados"}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;