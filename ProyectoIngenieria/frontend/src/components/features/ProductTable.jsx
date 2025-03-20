import React from "react";
import { Button, Input } from "../common";
import { Plus, Minus, Trash } from "lucide-react";
import "./styles/productTable.css";

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

const ProductTable = ({ selectedProducts, updateProductQuantity, removeProduct }) => {
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
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedProducts.length > 0 ? (
                        selectedProducts.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>₡{product.price.toLocaleString()}</td>
                                <td>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={product.quantity}
                                        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value, 10) || 1)}
                                        style={{ textAlign: "center" }}
                                    />
                                </td>
                                <td>₡{product.subtotal.toLocaleString()}</td>
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
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="no-data-message">
                                No hay productos seleccionados
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;